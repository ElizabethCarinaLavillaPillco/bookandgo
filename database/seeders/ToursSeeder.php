<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tour;
use App\Models\TourImage;
use App\Models\Agency;
use App\Models\Category;
use Illuminate\Support\Str;

class ToursSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('🎯 Creando tours...');

        $agencies = Agency::all();
        $categories = Category::all();

        $tours = [
            [
                'agency_id' => $agencies[0]->id,
                'category_id' => $categories->where('name', 'Aventura')->first()->id,
                'title' => 'Camino Inca Clásico 4 Días a Machu Picchu',
                'description' => 'Experimenta la legendaria ruta del Camino Inca hacia Machu Picchu. Un viaje de 4 días atravesando paisajes andinos impresionantes, sitios arqueológicos incas y culminando con el amanecer en la ciudadela perdida de los Incas.',
                'itinerary' => "Día 1: Cusco - Km 82 - Wayllabamba (12km)\nSalida temprano desde Cusco. Inicio de caminata en el km 82. Almuerzo en ruta. Campamento en Wayllabamba (3,000 msnm).\n\nDía 2: Wayllabamba - Paso Warmihuañusca - Pacaymayo (11km)\nDía más desafiante. Ascenso al paso Warmihuañusca (4,215 msnm). Descenso a Pacaymayo. Vistas espectaculares.\n\nDía 3: Pacaymayo - Wiñay Wayna (16km)\nVisita a ruinas de Runkurakay y Sayacmarca. Paso por túnel inca. Campamento en Wiñay Wayna con vista a las ruinas.\n\nDía 4: Wiñay Wayna - Machu Picchu - Cusco\nSalida a las 4am hacia Inti Punku (Puerta del Sol). Amanecer en Machu Picchu. Tour guiado de 2 horas. Retorno a Cusco.",
                'includes' => "• Guía profesional bilingüe certificado\n• Entrada a Machu Picchu\n• Transporte Cusco - Km 82\n• Tren Aguas Calientes - Ollantaytambo\n• Bus Aguas Calientes - Machu Picchu\n• 3 noches de camping con carpas profesionales\n• Todas las comidas (3 desayunos, 3 almuerzos, 3 cenas)\n• Snacks y agua durante el trek\n• Porteadores para equipaje común\n• Botiquín de primeros auxilios\n• Oxígeno de emergencia",
                'excludes' => "• Propinas para guías y porteadores\n• Bebidas alcohólicas\n• Seguro de viaje personal\n• Porteador personal (disponible por USD 80)\n• Bastones de trekking (alquiler USD 15)\n• Entrada a Huayna Picchu (USD 75 adicional)\n• Sleeping bag (alquiler USD 20)",
                'requirements' => "• Buen estado físico (caminatas de 6-8 horas diarias)\n• Pasaporte vigente\n• Reservar con 6 meses de anticipación\n• Aclimatación de 2-3 días en Cusco\n• Edad mínima: 12 años\n• Vacuna contra fiebre amarilla (recomendada)",
                'cancellation_policy' => "Cancelación gratuita hasta 30 días antes. Entre 30-15 días: 50% de reembolso. Menos de 15 días: sin reembolso.",
                'refund_policy' => 'partial',
                'cancellation_hours' => 720, // 30 días
                'price' => 650.00,
                'discount_price' => 580.00,
                'duration_days' => 4,
                'duration_hours' => 0,
                'max_people' => 16,
                'min_people' => 2,
                'difficulty_level' => 'hard',
                'location_city' => 'Cusco',
                'location_region' => 'Cusco',
                'location_country' => 'Peru',
                'latitude' => -13.163141,
                'longitude' => -72.545128,
                'featured_image' => 'https://images.unsplash.com/photo-1587595431973-160d0d94add1',
                'rating' => 4.9,
                'total_reviews' => 87,
                'total_bookings' => 124,
                'is_featured' => true,
                'is_active' => true,
                'is_published' => true,
                'published_at' => now(),
                'creation_step' => 5,
                'admin_verified' => true,
                'admin_verified_at' => now(),
                'available_days' => json_encode([1, 2, 3, 4, 5, 6, 0]),
                'quality_checklist' => json_encode([
                    'has_title' => true,
                    'has_description' => true,
                    'has_itinerary' => true,
                    'has_price' => true,
                    'has_images' => true,
                    'min_images_met' => true,
                ]),
                'images' => [
                    'https://images.unsplash.com/photo-1587595431973-160d0d94add1',
                    'https://images.unsplash.com/photo-1526392060635-9d6019884377',
                    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
                    'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4',
                ],
            ],
            // Agregar más tours...
        ];

        foreach ($tours as $tourData) {
            $images = $tourData['images'];
            unset($tourData['images']);
            
            $tourData['slug'] = Str::slug($tourData['title']);
            $tour = Tour::create($tourData);

            // Crear imágenes del tour
            foreach ($images as $index => $imageUrl) {
                TourImage::create([
                    'tour_id' => $tour->id,
                    'image_url' => $imageUrl,
                    'alt_text' => $tour->title,
                    'order' => $index + 1,
                    'is_primary' => $index === 0,
                ]);
            }
        }

        $this->command->info('✅ Tours creados: ' . Tour::count());
        $this->command->info('✅ Imágenes creadas: ' . TourImage::count());
    }
}