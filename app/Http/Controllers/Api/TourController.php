<?php
// app/Http/Controllers/Api/TourController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tour;
use App\Models\TourImage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class TourController extends Controller
{
    // Listar tours (público)
    public function index(Request $request)
    {
        $query = Tour::with(['category', 'agency.user'])
            ->where('is_published', true)
            ->where('is_active', true);

        // Filtros
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        $tours = $query->paginate($request->per_page ?? 12);

        return response()->json($tours);
    }

    // Tours destacados
    public function featured()
    {
        $tours = Tour::with(['category', 'agency.user'])
            ->where('is_featured', true)
            ->where('is_published', true)
            ->where('is_active', true)
            ->limit(8)
            ->get();

        return response()->json($tours);
    }

    // Ver tour específico
    public function show($id)
    {
        $tour = Tour::with(['category', 'agency.user', 'images', 'reviews.user'])
            ->findOrFail($id);

        return response()->json($tour);
    }

    // Tours relacionados
    public function related($id)
    {
        $tour = Tour::findOrFail($id);

        $related = Tour::with(['category', 'agency.user'])
            ->where('id', '!=', $id)
            ->where('category_id', $tour->category_id)
            ->where('is_published', true)
            ->where('is_active', true)
            ->limit(4)
            ->get();

        return response()->json($related);
    }

    // Crear tour (solo agencias)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string',
            'location_city' => 'required|string|max:100',
            'location_region' => 'required|string|max:100',
            'location_country' => 'required|string|max:100',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0|lt:price',
            'duration_days' => 'required|integer|min:0',
            'duration_hours' => 'required|integer|min:0|max:23',
            'max_people' => 'required|integer|min:1',
            'min_people' => 'required|integer|min:1',
            'difficulty_level' => 'required|in:easy,moderate,hard',
            'itinerary' => 'required|string',
            'includes' => 'required|string',
            'excludes' => 'required|string',
            'requirements' => 'required|string',
            'cancellation_policy' => 'required|string',
            'cancellation_hours' => 'required|integer|min:0',
            'featured_image' => 'required|url',
            'images' => 'nullable|array',
            'images.*' => 'url',
            'is_published' => 'boolean',
        ]);

        DB::beginTransaction();

        try {
            // Crear tour
            $tour = Tour::create([
                'agency_id' => $request->user()->agency->id,
                'category_id' => $validated['category_id'],
                'title' => $validated['title'],
                'slug' => Str::slug($validated['title']),
                'description' => $validated['description'],
                'location_city' => $validated['location_city'],
                'location_region' => $validated['location_region'],
                'location_country' => $validated['location_country'],
                'price' => $validated['price'],
                'discount_price' => $validated['discount_price'] ?? null,
                'duration_days' => $validated['duration_days'],
                'duration_hours' => $validated['duration_hours'],
                'max_people' => $validated['max_people'],
                'min_people' => $validated['min_people'],
                'difficulty_level' => $validated['difficulty_level'],
                'itinerary' => $validated['itinerary'],
                'includes' => $validated['includes'],
                'excludes' => $validated['excludes'],
                'requirements' => $validated['requirements'],
                'cancellation_policy' => $validated['cancellation_policy'],
                'cancellation_hours' => $validated['cancellation_hours'],
                'featured_image' => $validated['featured_image'],
                'is_published' => $validated['is_published'] ?? false,
                'is_active' => true,
                'published_at' => ($validated['is_published'] ?? false) ? now() : null,
            ]);

            // Crear imágenes adicionales
            if (!empty($validated['images'])) {
                foreach ($validated['images'] as $index => $imageUrl) {
                    TourImage::create([
                        'tour_id' => $tour->id,
                        'image_url' => $imageUrl,
                        'alt_text' => $tour->title,
                        'order' => $index + 1,
                        'is_primary' => false,
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Tour creado exitosamente',
                'data' => $tour->load(['category', 'images']),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el tour: ' . $e->getMessage(),
            ], 500);
        }
    }

    // Actualizar tour
    public function update(Request $request, $id)
    {
        $tour = Tour::where('agency_id', $request->user()->agency->id)
            ->findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'category_id' => 'sometimes|exists:categories,id',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            // ... otros campos
        ]);

        $tour->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Tour actualizado exitosamente',
            'data' => $tour,
        ]);
    }

    // Eliminar tour
    public function destroy(Request $request, $id)
    {
        $tour = Tour::where('agency_id', $request->user()->agency->id)
            ->findOrFail($id);

        $tour->delete();

        return response()->json([
            'success' => true,
            'message' => 'Tour eliminado exitosamente',
        ]);
    }

    // Publicar tour
    public function publish(Request $request, $id)
    {
        $tour = Tour::where('agency_id', $request->user()->agency->id)
            ->findOrFail($id);

        $tour->update([
            'is_published' => true,
            'published_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Tour publicado exitosamente',
            'data' => $tour,
        ]);
    }
}