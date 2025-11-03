<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\User;
use App\Models\Tour;
use Carbon\Carbon;

class BookingsSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('📅 Creando reservas...');

        $customers = User::where('role', 'customer')->get();
        $tours = Tour::all();

        if ($customers->isEmpty() || $tours->isEmpty()) {
            $this->command->warn('⚠️  No hay clientes o tours disponibles');
            return;
        }

        $bookings = [
            // ✅ Reserva confirmada y pagada
            [
                'user' => $customers[0],
                'tour' => $tours[0],
                'booking_date' => Carbon::now()->addDays(30),
                'booking_time' => '08:00:00',
                'number_of_people' => 2,
                'status' => 'confirmed',
                'confirmed_at' => now(),
                'timeline' => json_encode([ // 👈 CONVERTIR A JSON
                    [
                        'status' => 'pending',
                        'date' => Carbon::now()->subDays(2)->toISOString(),
                        'description' => 'Reserva creada'
                    ],
                    [
                        'status' => 'confirmed',
                        'date' => Carbon::now()->subDays(1)->toISOString(),
                        'description' => 'Pago confirmado'
                    ],
                ]),
                'meeting_point' => 'Plaza de Armas de Cusco - Frente a la Catedral',
                'agency_instructions' => 'Por favor llegar 15 minutos antes. Llevar documento de identidad original.',
                'payment_status' => 'completed',
            ],
            // ✅ Reserva pendiente de pago
            [
                'user' => $customers[1],
                'tour' => $tours[0],
                'booking_date' => Carbon::now()->addDays(45),
                'booking_time' => '08:00:00',
                'number_of_people' => 4,
                'status' => 'pending',
                'confirmed_at' => null,
                'timeline' => json_encode([ // 👈 CONVERTIR A JSON
                    [
                        'status' => 'pending',
                        'date' => Carbon::now()->subHours(2)->toISOString(),
                        'description' => 'Reserva creada - Esperando pago'
                    ],
                ]),
                'meeting_point' => null,
                'agency_instructions' => null,
                'payment_status' => 'pending',
            ],
            // ✅ Reserva completada
            [
                'user' => $customers[2],
                'tour' => $tours[0],
                'booking_date' => Carbon::now()->subDays(7),
                'booking_time' => '08:00:00',
                'number_of_people' => 2,
                'status' => 'completed',
                'confirmed_at' => Carbon::now()->subDays(14),
                'checked_in_at' => Carbon::now()->subDays(7)->setHour(8),
                'completed_at' => Carbon::now()->subDays(3),
                'timeline' => json_encode([ // 👈 CONVERTIR A JSON
                    [
                        'status' => 'pending',
                        'date' => Carbon::now()->subDays(14)->toISOString(),
                        'description' => 'Reserva creada'
                    ],
                    [
                        'status' => 'confirmed',
                        'date' => Carbon::now()->subDays(14)->toISOString(),
                        'description' => 'Pago confirmado'
                    ],
                    [
                        'status' => 'in_progress',
                        'date' => Carbon::now()->subDays(7)->toISOString(),
                        'description' => 'Tour iniciado'
                    ],
                    [
                        'status' => 'completed',
                        'date' => Carbon::now()->subDays(3)->toISOString(),
                        'description' => 'Tour completado'
                    ],
                ]),
                'meeting_point' => 'Plaza de Armas de Cusco - Frente a la Catedral',
                'agency_instructions' => 'Por favor llegar 15 minutos antes.',
                'payment_status' => 'completed',
                'reminder_sent' => true,
                'reminder_sent_at' => Carbon::now()->subDays(9),
            ],
            // ✅ Reserva cancelada
            [
                'user' => $customers[3],
                'tour' => $tours[0],
                'booking_date' => Carbon::now()->addDays(15),
                'booking_time' => '08:00:00',
                'number_of_people' => 1,
                'status' => 'cancelled',
                'confirmed_at' => Carbon::now()->subDays(5),
                'cancelled_at' => Carbon::now()->subDays(2),
                'cancellation_reason' => 'Cambio de planes personales',
                'timeline' => json_encode([ // 👈 CONVERTIR A JSON
                    [
                        'status' => 'pending',
                        'date' => Carbon::now()->subDays(5)->toISOString(),
                        'description' => 'Reserva creada'
                    ],
                    [
                        'status' => 'confirmed',
                        'date' => Carbon::now()->subDays(5)->toISOString(),
                        'description' => 'Pago confirmado'
                    ],
                    [
                        'status' => 'cancelled',
                        'date' => Carbon::now()->subDays(2)->toISOString(),
                        'description' => 'Cancelado por el cliente'
                    ],
                ]),
                'meeting_point' => null,
                'agency_instructions' => null,
                'payment_status' => 'refunded',
            ],
        ];

        foreach ($bookings as $bookingData) {
            $user = $bookingData['user'];
            $tour = $bookingData['tour'];
            $paymentStatus = $bookingData['payment_status'];
            
            unset($bookingData['user'], $bookingData['tour'], $bookingData['payment_status']);

            $pricePerPerson = $tour->discount_price ?? $tour->price;
            $subtotal = $pricePerPerson * $bookingData['number_of_people'];
            $tax = $subtotal * 0.18;
            $totalPrice = $subtotal + $tax;

            $booking = Booking::create([
                'user_id' => $user->id,
                'tour_id' => $tour->id,
                'agency_id' => $tour->agency_id,
                'booking_number' => 'BG-' . strtoupper(uniqid()), // 👈 Generar aquí
                'qr_code' => 'QR-' . strtoupper(uniqid()),
                'price_per_person' => $pricePerPerson,
                'subtotal' => $subtotal,
                'discount' => 0,
                'tax' => $tax,
                'total_price' => $totalPrice,
                'customer_name' => $user->name,
                'customer_email' => $user->email,
                'customer_phone' => $user->phone,
                'agency_whatsapp' => $tour->agency->phone ?? $tour->agency->user->phone,
                ...$bookingData // 👈 Spread del resto
            ]);

            // ✅ Crear pago asociado
            Payment::create([
                'booking_id' => $booking->id,
                'user_id' => $user->id,
                'transaction_id' => 'TXN-' . strtoupper(uniqid()),
                'payment_method' => 'credit_card',
                'amount' => $totalPrice,
                'currency' => 'PEN',
                'status' => $paymentStatus,
                'paid_at' => $paymentStatus === 'completed' ? $booking->confirmed_at : null,
                'refunded_at' => $paymentStatus === 'refunded' ? $booking->cancelled_at : null,
            ]);
        }

        $this->command->info('✅ Reservas creadas: ' . Booking::count());
        $this->command->info('✅ Pagos creados: ' . Payment::count());
    }
}