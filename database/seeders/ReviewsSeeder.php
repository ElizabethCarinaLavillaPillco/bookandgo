<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Review;
use App\Models\Booking;
use Carbon\Carbon;

class ReviewsSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('⭐ Creando reseñas...');

        // Solo crear reseñas para bookings completados
        $completedBookings = Booking::where('status', 'completed')->get();

        if ($completedBookings->isEmpty()) {
            $this->command->warn('⚠️  No hay reservas completadas para crear reseñas');
            return;
        }

        $reviews = [
            [
                'rating' => 5,
                'title' => '¡Experiencia inolvidable!',
                'comment' => 'El Camino Inca superó todas mis expectativas. Nuestro guía Wally fue excepcional, muy conocedor de la historia inca y siempre atento a las necesidades del grupo. Las vistas son espectaculares y llegar a Machu Picchu al amanecer fue simplemente mágico. La comida durante el trek fue sorprendentemente buena. 100% recomendado.',
                'service_rating' => 5,
                'value_rating' => 5,
                'guide_rating' => 5,
                'is_verified' => true,
                'is_approved' => true,
                'helpful_count' => 12,
            ],
            [
                'rating' => 4,
                'title' => 'Muy buena experiencia',
                'comment' => 'Tour muy bien organizado. El segundo día fue el más desafiante pero valió totalmente la pena. Mi única observación es que las carpas podrían estar en mejor estado, pero fuera de eso, todo perfecto. El equipo fue muy profesional y la logística impecable.',
                'service_rating' => 4,
                'value_rating' => 4,
                'guide_rating' => 5,
                'is_verified' => true,
                'is_approved' => true,
                'helpful_count' => 8,
            ],
            [
                'rating' => 5,
                'title' => 'Lo mejor que he hecho',
                'comment' => 'Increíble tour por la historia inca. Los porteadores fueron súper serviciales y la comida deliciosa. Recomiendo estar bien aclimatado antes de empezar. Las ruinas en el camino son fascinantes y el guía explicó todo detalladamente. Sin duda lo volvería a hacer.',
                'service_rating' => 5,
                'value_rating' => 5,
                'guide_rating' => 5,
                'is_verified' => true,
                'is_approved' => true,
                'helpful_count' => 15,
            ],
        ];

        foreach ($completedBookings as $index => $booking) {
            if (isset($reviews[$index])) {
                $reviewData = $reviews[$index];
                
                Review::create([
                    'user_id' => $booking->user_id,
                    'tour_id' => $booking->tour_id,
                    'booking_id' => $booking->id,
                    'agency_id' => $booking->agency_id,
                    'rating' => $reviewData['rating'],
                    'title' => $reviewData['title'],
                    'comment' => $reviewData['comment'],
                    'service_rating' => $reviewData['service_rating'],
                    'value_rating' => $reviewData['value_rating'],
                    'guide_rating' => $reviewData['guide_rating'],
                    'is_verified' => $reviewData['is_verified'],
                    'is_approved' => $reviewData['is_approved'],
                    'helpful_count' => $reviewData['helpful_count'],
                    'created_at' => Carbon::now()->subDays(rand(1, 30)),
                ]);

                // Actualizar ratings del tour
                $booking->tour->updateRating();
            }
        }

        $this->command->info('✅ Reseñas creadas: ' . Review::count());
    }
}