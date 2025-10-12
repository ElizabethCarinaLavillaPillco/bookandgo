<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Tour;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Booking::with(['tour.images', 'tour.agency', 'payment']);

        if ($user->isAgency()) {
            $query->where('agency_id', $user->agency->id);
        } else {
            $query->where('user_id', $user->id);
        }

        // Filtros
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('upcoming')) {
            $query->upcoming();
        }

        if ($request->has('past')) {
            $query->past();
        }

        $bookings = $query->latest()->paginate(15);

        return response()->json($bookings);
    }

    public function show($id)
    {
        $user = request()->user();
        $booking = Booking::with([
            'tour.images',
            'tour.agency.user',
            'payment',
            'review'
        ])->findOrFail($id);

        // Verificar permisos
        if ($booking->user_id !== $user->id && 
            (!$user->isAgency() || $booking->agency_id !== $user->agency->id)) {
            return response()->json([
                'message' => 'No tienes permiso para ver esta reserva'
            ], 403);
        }

        return response()->json($booking);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tour_id' => 'required|exists:tours,id',
            'booking_date' => 'required|date|after:today',
            'booking_time' => 'nullable',
            'number_of_people' => 'required|integer|min:1',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email',
            'customer_phone' => 'required|string|max:20',
            'special_requirements' => 'nullable|string|max:500',
        ]);

        $tour = Tour::findOrFail($validated['tour_id']);
        $user = $request->user();

        // Validar disponibilidad
        if ($validated['number_of_people'] > $tour->max_people) {
            return response()->json([
                'message' => "El tour solo acepta un máximo de {$tour->max_people} personas"
            ], 422);
        }

        // Calcular precios
        $pricePerPerson = $tour->getCurrentPrice();
        $subtotal = $pricePerPerson * $validated['number_of_people'];
        $discount = 0; // Aquí puedes agregar lógica de descuentos
        $tax = $subtotal * 0.18; // IGV 18% en Perú
        $totalPrice = $subtotal - $discount + $tax;

        DB::beginTransaction();
        try {
            $booking = Booking::create([
                'user_id' => $user->id,
                'tour_id' => $tour->id,
                'agency_id' => $tour->agency_id,
                'booking_date' => $validated['booking_date'],
                'booking_time' => $validated['booking_time'] ?? null,
                'number_of_people' => $validated['number_of_people'],
                'price_per_person' => $pricePerPerson,
                'subtotal' => $subtotal,
                'discount' => $discount,
                'tax' => $tax,
                'total_price' => $totalPrice,
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'],
                'customer_phone' => $validated['customer_phone'],
                'special_requirements' => $validated['special_requirements'] ?? null,
                'status' => 'pending',
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Reserva creada exitosamente',
                'booking' => $booking->load('tour', 'payment')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al crear la reserva',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function cancel(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);
        $user = $request->user();

        if ($booking->user_id !== $user->id) {
            return response()->json([
                'message' => 'No tienes permiso para cancelar esta reserva'
            ], 403);
        }

        if (!$booking->canBeCancelled()) {
            return response()->json([
                'message' => 'Esta reserva no puede ser cancelada'
            ], 422);
        }

        $validated = $request->validate([
            'reason' => 'required|string|max:500'
        ]);

        $booking->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'cancellation_reason' => $validated['reason']
        ]);

        return response()->json([
            'message' => 'Reserva cancelada exitosamente',
            'booking' => $booking
        ]);
    }

    public function confirm($id)
    {
        $booking = Booking::findOrFail($id);
        $user = request()->user();

        if (!$user->isAgency() || $booking->agency_id !== $user->agency->id) {
            return response()->json([
                'message' => 'No tienes permiso para confirmar esta reserva'
            ], 403);
        }

        $booking->update([
            'status' => 'confirmed',
            'confirmed_at' => now()
        ]);

        return response()->json([
            'message' => 'Reserva confirmada exitosamente',
            'booking' => $booking
        ]);
    }
}
            