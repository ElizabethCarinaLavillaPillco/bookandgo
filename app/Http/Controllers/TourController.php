<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tour;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TourController extends Controller
{
    public function index(Request $request)
    {
        $query = Tour::with(['agency', 'category', 'images'])
            ->active();

        // Filtros
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('location_city', 'like', "%{$search}%");
            });
        }

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('location')) {
            $query->byLocation($request->location);
        }

        if ($request->has('min_price') || $request->has('max_price')) {
            $query->priceRange($request->min_price, $request->max_price);
        }

        if ($request->has('difficulty')) {
            $query->where('difficulty_level', $request->difficulty);
        }

        if ($request->has('duration_days')) {
            $query->where('duration_days', '<=', $request->duration_days);
        }

        // Ordenamiento
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        
        $allowedSorts = ['created_at', 'price', 'rating', 'title'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder);
        }

        // Featured first
        if ($request->get('featured_first')) {
            $query->orderBy('is_featured', 'desc');
        }

        $tours = $query->paginate($request->get('per_page', 12));

        return response()->json($tours);
    }

    public function show($id)
    {
        $tour = Tour::with([
            'agency.user',
            'category',
            'images',
            'reviews' => function($query) {
                $query->approved()->latest()->limit(10);
            },
            'reviews.user'
        ])->findOrFail($id);

        return response()->json($tour);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        
        if (!$user->isAgency() || !$user->agency) {
            return response()->json([
                'message' => 'Solo las agencias pueden crear tours'
            ], 403);
        }

        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'itinerary' => 'nullable|string',
            'includes' => 'nullable|string',
            'excludes' => 'nullable|string',
            'requirements' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0|lt:price',
            'duration_days' => 'required|integer|min:1',
            'duration_hours' => 'nullable|integer|min:0|max:23',
            'max_people' => 'required|integer|min:1',
            'min_people' => 'nullable|integer|min:1',
            'difficulty_level' => 'nullable|in:easy,moderate,hard',
            'location_city' => 'required|string|max:100',
            'location_region' => 'required|string|max:100',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'featured_image' => 'required|image|max:5120', // 5MB
            'available_from' => 'nullable|date',
            'available_to' => 'nullable|date|after:available_from',
            'available_days' => 'nullable|array',
        ]);

        // Upload featured image
        if ($request->hasFile('featured_image')) {
            $path = $request->file('featured_image')->store('tours', 'public');
            $validated['featured_image'] = $path;
        }

        $validated['agency_id'] = $user->agency->id;
        $validated['slug'] = Str::slug($validated['title']);

        $tour = Tour::create($validated);

        return response()->json([
            'message' => 'Tour creado exitosamente',
            'tour' => $tour->load('category', 'images')
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $tour = Tour::findOrFail($id);
        $user = $request->user();

        if ($tour->agency_id !== $user->agency->id && !$user->isAdmin()) {
            return response()->json([
                'message' => 'No tienes permiso para editar este tour'
            ], 403);
        }

        $validated = $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'max_people' => 'sometimes|integer|min:1',
            'is_active' => 'sometimes|boolean',
            // ... otros campos
        ]);

        if ($request->hasFile('featured_image')) {
            // Eliminar imagen anterior
            if ($tour->featured_image) {
                Storage::disk('public')->delete($tour->featured_image);
            }
            $path = $request->file('featured_image')->store('tours', 'public');
            $validated['featured_image'] = $path;
        }

        $tour->update($validated);

        return response()->json([
            'message' => 'Tour actualizado exitosamente',
            'tour' => $tour
        ]);
    }

    public function destroy($id)
    {
        $tour = Tour::findOrFail($id);
        $user = request()->user();

        if ($tour->agency_id !== $user->agency->id && !$user->isAdmin()) {
            return response()->json([
                'message' => 'No tienes permiso para eliminar este tour'
            ], 403);
        }

        $tour->delete(); // Soft delete

        return response()->json([
            'message' => 'Tour eliminado exitosamente'
        ]);
    }

    public function featured()
    {
        $tours = Tour::with(['agency', 'category', 'images'])
            ->active()
            ->featured()
            ->limit(8)
            ->get();

        return response()->json($tours);
    }

    public function related($id)
    {
        $tour = Tour::findOrFail($id);
        
        $relatedTours = Tour::with(['agency', 'category', 'images'])
            ->active()
            ->where('id', '!=', $id)
            ->where(function($query) use ($tour) {
                $query->where('category_id', $tour->category_id)
                      ->orWhere('location_city', $tour->location_city);
            })
            ->limit(4)
            ->get();

        return response()->json($relatedTours);
    }
}