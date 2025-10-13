<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Agency;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AgencyController extends Controller
{
    public function index(Request $request)
    {
        $agencies = Agency::with('user')
            ->where('is_verified', true)
            ->when($request->has('search'), function($query) use ($request) {
                $search = $request->search;
                $query->where('business_name', 'like', "%{$search}%")
                      ->orWhere('city', 'like', "%{$search}%");
            })
            ->withCount('tours')
            ->orderBy('rating', 'desc')
            ->paginate(12);

        return response()->json($agencies);
    }

    public function show($id)
    {
        $agency = Agency::with([
            'user',
            'tours' => function($query) {
                $query->active()->with(['category', 'images'])->latest();
            },
            'reviews' => function($query) {
                $query->approved()->with('user')->latest()->limit(10);
            }
        ])->findOrFail($id);

        return response()->json($agency);
    }

    public function dashboard(Request $request)
    {
        $user = $request->user();
        
        if (!$user->isAgency() || !$user->agency) {
            return response()->json([
                'message' => 'No tienes acceso a este recurso'
            ], 403);
        }

        $agency = $user->agency;

        // Estadísticas
        $stats = [
            'total_tours' => $agency->tours()->count(),
            'active_tours' => $agency->tours()->active()->count(),
            'total_bookings' => $agency->bookings()->count(),
            'pending_bookings' => $agency->bookings()->pending()->count(),
            'total_revenue' => $agency->bookings()
                ->where('status', 'completed')
                ->sum('total_price'),
            'this_month_revenue' => $agency->bookings()
                ->where('status', 'completed')
                ->whereMonth('created_at', now()->month)
                ->sum('total_price'),
            'average_rating' => round($agency->rating, 2),
            'total_reviews' => $agency->total_reviews,
        ];

        // Reservas recientes
        $recentBookings = $agency->bookings()
            ->with(['tour', 'user'])
            ->latest()
            ->limit(10)
            ->get();

        // Tours más vendidos
        $topTours = $agency->tours()
            ->orderBy('total_bookings', 'desc')
            ->with('images')
            ->limit(5)
            ->get();

        // Ingresos por mes (últimos 6 meses)
        $monthlyRevenue = $agency->bookings()
            ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, SUM(total_price) as revenue')
            ->where('status', 'completed')
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return response()->json([
            'stats' => $stats,
            'recent_bookings' => $recentBookings,
            'top_tours' => $topTours,
            'monthly_revenue' => $monthlyRevenue,
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();
        
        if (!$user->isAgency() || !$user->agency) {
            return response()->json([
                'message' => 'No tienes acceso a este recurso'
            ], 403);
        }

        $validated = $request->validate([
            'business_name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'phone' => 'sometimes|string|max:20',
            'website' => 'nullable|url|max:255',
            'address' => 'sometimes|string|max:255',
            'city' => 'sometimes|string|max:100',
            'logo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('agencies', 'public');
            $validated['logo'] = $path;
        }

        $user->agency->update($validated);

        return response()->json([
            'message' => 'Perfil de agencia actualizado exitosamente',
            'agency' => $user->agency
        ]);
    }
}