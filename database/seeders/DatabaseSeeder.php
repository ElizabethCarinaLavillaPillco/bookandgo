<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Agency;
use App\Models\Category;
use App\Models\Tour;
use App\Models\TourImage;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Crear admin
        $admin = User::create([
            'name' => 'Administrador',
            'email' => 'admin@bookandgo.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'phone' => '999888777',
            'is_active' => true,
        ]);

        // Crear categorías
        $categories = [
            [
                'name' => 'Aventura',
                'slug' => 'aventura',
                'description' => 'Tours de aventura y deportes extremos',
                'icon' => 'Mountain',
                'is_active' => true,
                'order' => 1,
            ],
            [
                'name' => 'Cultural',
                'slug' => 'cultural',
                'description' => 'Tours culturales e históricos',
                'icon' => 'Landmark',
                'is_active' => true,
                'order' => 2,
            ],
            [
                'name' => 'Naturaleza',
                'slug' => 'naturaleza',
                'description' => 'Tours de naturaleza y ecoturismo',
                'icon' => 'Trees',
                'is_active' => true,
                'order' => 3,
            ],
            [
                'name' => 'Gastronomía',
                'slug' => 'gastronomia',
                'description' => 'Tours gastronómicos',
                'icon' => 'UtensilsCrossed',
                'is_active' => true,
                'order' => 4,
            ],
            [
                'name' => 'Playas',
                'slug' => 'playas',
                'description' => 'Tours de playas y costas',
                'icon' => 'Waves',
                'is_active' => true,
                'order' => 5,
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }

        // Crear usuarios clientes
        $customer1 = User::create([
            'name' => 'Juan Pérez',
            'email' => 'juan@example.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'phone' => '987654321',
            'country' => 'Perú',
            'city' => 'Lima',
            'is_active' => true,
        ]);

        $customer2 = User::create([
            'name' => 'María García',
            'email' => 'maria@example.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'phone' => '987654322',
            'country' => 'Perú',
            'city' => 'Cusco',
            'is_active' => true,
        ]);

        // Crear agencias
        $agencyUser1 = User::create([
            'name' => 'Inca Adventures',
            'email' => 'inca@bookandgo.com',
            'password' => Hash::make('password'),
            'role' => 'agency',
            'phone' => '984123456',
            'is_active' => true,
        ]);

        $agency1 = Agency::create([
            'user_id' => $agencyUser1->id,
            'business_name' => 'Inca Adventures SAC',
            'ruc_tax_id' => '20123456789',
            'description' => 'Somos una agencia especializada en tours de aventura y culturales en Cusco. Con más de 10 años de experiencia.',
            'phone' => '984123456',
            'website' => 'https://incaadventures.com',
            'address' => 'Av. El Sol 123',
            'city' => 'Cusco',
            'country' => 'Peru',
            'rating' => 4.8,
            'total_reviews' => 156,
            'is_verified' => true,
            'verified_at' => now(),
        ]);

        $agencyUser2 = User::create([
            'name' => 'Peru Mágico',
            'email' => 'perumagico@bookandgo.com',
            'password' => Hash::make('password'),
            'role' => 'agency',
            'phone' => '984123457',
            'is_active' => true,
        ]);

        $agency2 = Agency::create([
            'user_id' => $agencyUser2->id,
            'business_name' => 'Peru Mágico Tours EIRL',
            'ruc_tax_id' => '20123456790',
            'description' => 'Tours personalizados por todo el Perú. Especialistas en experiencias gastronómicas.',
            'phone' => '984123457',
            'website' => 'https://perumagico.com',
            'address' => 'Jr. Trujillo 456',
            'city' => 'Lima',
            'country' => 'Peru',
            'rating' => 4.6,
            'total_reviews' => 98,
            'is_verified' => true,
            'verified_at' => now(),
        ]);

        $agencyUser3 = User::create([
            'name' => 'Amazonia Expeditions',
            'email' => 'amazonia@bookandgo.com',
            'password' => Hash::make('password'),
            'role' => 'agency',
            'phone' => '984123458',
            'is_active' => true,
        ]);

        $agency3 = Agency::create([
            'user_id' => $agencyUser3->id,
            'business_name' => 'Amazonia Expeditions SAC',
            'ruc_tax_id' => '20123456791',
            'description' => 'Exploraciones únicas en la selva amazónica peruana.',
            'phone' => '984123458',
            'address' => 'Av. Iquitos 789',
            'city' => 'Iquitos',
            'country' => 'Peru',
            'rating' => 4.9,
            'total_reviews' => 203,
            'is_verified' => true,
            'verified_at' => now(),
        ]);

        // Crear tours
        $tours = [
            [
                'agency_id' => $agency1->id,
                'category_id' => 1, // Aventura
                'title' => 'Camino Inca Clásico 4 Días',
                'slug' => 'camino-inca-clasico-4-dias',
                'description' => 'Experimenta la legendaria ruta del Camino Inca hacia Machu Picchu. Un viaje de 4 días atravesando paisajes andinos impresionantes, sitios arqueológicos incas y culminando con el amanecer en Machu Picchu.',
                'itinerary' => 'Día 1: Cusco - Km 82 - Wayllabamba\nDía 2: Wayllabamba - Pacaymayo - Chaquicocha\nDía 3: Chaquicocha - Wiñay Wayna\nDía 4: Wiñay Wayna - Machu Picchu - Cusco',
                'includes' => 'Guía profesional bilingüe, Entrada a Machu Picchu, Transporte, 3 noches de camping, Todas las comidas, Porteadores',
                'excludes' => 'Propinas, Bebidas alcohólicas, Seguro de viaje',
                'requirements' => 'Buen estado físico, Pasaporte vigente, Reservar con 6 meses de anticipación',
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
                'available_days' => [1, 2, 3, 4, 5, 6, 0],
            ],
            [
                'agency_id' => $agency1->id,
                'category_id' => 2, // Cultural
                'title' => 'City Tour Cusco y Ruinas',
                'slug' => 'city-tour-cusco-ruinas',
                'description' => 'Descubre la capital arqueológica de América. Visita Qoricancha, Sacsayhuamán, Qenqo, Puca Pucara y Tambomachay en este recorrido de medio día.',
                'itinerary' => '09:00 - Recojo del hotel\n09:30 - Qoricancha\n11:00 - Sacsayhuamán\n12:00 - Qenqo\n12:30 - Puca Pucara\n13:00 - Tambomachay\n14:00 - Retorno al hotel',
                'includes' => 'Guía turístico, Transporte, Entradas',
                'excludes' => 'Almuerzo, Propinas',
                'requirements' => 'Llevar protector solar, agua, gorra',
                'price' => 45.00,
                'discount_price' => null,
                'duration_days' => 0,
                'duration_hours' => 5,
                'max_people' => 20,
                'min_people' => 2,
                'difficulty_level' => 'easy',
                'location_city' => 'Cusco',
                'location_region' => 'Cusco',
                'location_country' => 'Peru',
                'latitude' => -13.531950,
                'longitude' => -71.967463,
                'featured_image' => 'https://images.unsplash.com/photo-1526392060635-9d6019884377',
                'rating' => 4.7,
                'total_reviews' => 156,
                'total_bookings' => 298,
                'is_featured' => true,
                'is_active' => true,
                'available_days' => [1, 2, 3, 4, 5, 6, 0],
            ],
            [
                'agency_id' => $agency1->id,
                'category_id' => 3, // Naturaleza
                'title' => 'Montaña de 7 Colores - Vinicunca',
                'slug' => 'montana-7-colores-vinicunca',
                'description' => 'Aventura hacia la impresionante Montaña de 7 Colores (5,200 msnm). Disfruta de paisajes únicos con colores naturales espectaculares.',
                'itinerary' => '04:00 - Recojo del hotel\n07:00 - Desayuno en Cusipata\n08:00 - Inicio de caminata\n10:30 - Llegada a Vinicunca\n12:00 - Retorno\n14:00 - Almuerzo buffet\n17:00 - Llegada a Cusco',
                'includes' => 'Transporte, Desayuno, Almuerzo, Guía, Entradas, Bastones de trekking, Oxígeno',
                'excludes' => 'Caballo (opcional S/80), Propinas',
                'requirements' => 'Aclimatación de 2 días en Cusco, Buen estado físico',
                'price' => 85.00,
                'discount_price' => 75.00,
                'duration_days' => 1,
                'duration_hours' => 0,
                'max_people' => 15,
                'min_people' => 2,
                'difficulty_level' => 'moderate',
                'location_city' => 'Cusco',
                'location_region' => 'Cusco',
                'location_country' => 'Peru',
                'latitude' => -13.867767,
                'longitude' => -71.302162,
                'featured_image' => 'https://images.unsplash.com/photo-1531065208531-4036c0dba3ca',
                'rating' => 4.8,
                'total_reviews' => 234,
                'total_bookings' => 456,
                'is_featured' => true,
                'is_active' => true,
                'available_days' => [1, 2, 3, 4, 5, 6, 0],
            ],
            [
                'agency_id' => $agency2->id,
                'category_id' => 4, // Gastronomía
                'title' => 'Tour Gastronómico por Lima',
                'slug' => 'tour-gastronomico-lima',
                'description' => 'Descubre la cocina peruana, considerada una de las mejores del mundo. Visita mercados locales y prueba los platos más emblemáticos.',
                'itinerary' => '10:00 - Mercado de Surquillo\n11:30 - Cevichería tradicional\n13:00 - Restaurante criollo\n15:00 - Distrito de Barranco\n16:30 - Cafetería artesanal',
                'includes' => 'Guía gastronómico, Transporte, Degustaciones, Bebidas',
                'excludes' => 'Propinas',
                'requirements' => 'Venir con hambre, Mencionar alergias alimentarias',
                'price' => 120.00,
                'discount_price' => null,
                'duration_days' => 0,
                'duration_hours' => 7,
                'max_people' => 12,
                'min_people' => 4,
                'difficulty_level' => 'easy',
                'location_city' => 'Lima',
                'location_region' => 'Lima',
                'location_country' => 'Peru',
                'latitude' => -12.046374,
                'longitude' => -77.042793,
                'featured_image' => 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
                'rating' => 4.9,
                'total_reviews' => 89,
                'total_bookings' => 167,
                'is_featured' => true,
                'is_active' => true,
                'available_days' => [2, 3, 4, 5, 6],
            ],
            [
                'agency_id' => $agency2->id,
                'category_id' => 5, // Playas
                'title' => 'Islas Ballestas y Reserva de Paracas',
                'slug' => 'islas-ballestas-paracas',
                'description' => 'Tour en lancha por las Islas Ballestas, conocidas como las "Galápagos peruanas". Observa lobos marinos, pingüinos de Humboldt y aves marinas.',
                'itinerary' => '07:00 - Salida de Lima\n10:00 - Llegada a Paracas\n10:30 - Tour en lancha Islas Ballestas\n12:30 - Almuerzo en Paracas\n14:00 - Reserva Nacional de Paracas\n17:00 - Retorno a Lima',
                'includes' => 'Transporte Lima-Paracas-Lima, Tour en lancha, Guía, Entrada a reserva',
                'excludes' => 'Almuerzo, Impuesto portuario S/16',
                'requirements' => 'Llevar bloqueador, lentes de sol, cámara',
                'price' => 95.00,
                'discount_price' => 85.00,
                'duration_days' => 1,
                'duration_hours' => 0,
                'max_people' => 20,
                'min_people' => 4,
                'difficulty_level' => 'easy',
                'location_city' => 'Paracas',
                'location_region' => 'Ica',
                'location_country' => 'Peru',
                'latitude' => -13.826667,
                'longitude' => -76.255833,
                'featured_image' => 'https://images.unsplash.com/photo-1559827260-dc66d52bef19',
                'rating' => 4.7,
                'total_reviews' => 145,
                'total_bookings' => 289,
                'is_featured' => true,
                'is_active' => true,
                'available_days' => [1, 2, 3, 4, 5, 6, 0],
            ],
            [
                'agency_id' => $agency3->id,
                'category_id' => 3, // Naturaleza
                'title' => 'Expedición Amazónica 3 Días',
                'slug' => 'expedicion-amazonica-3-dias',
                'description' => 'Sumérgete en la selva amazónica peruana. Navega por el río Amazonas, observa delfines rosados, caimanes y una increíble biodiversidad.',
                'itinerary' => 'Día 1: Iquitos - Lodge - Caminata nocturna\nDía 2: Observación de delfines - Pesca de pirañas - Comunidad nativa\nDía 3: Avistamiento de aves - Retorno a Iquitos',
                'includes' => 'Transporte, Alojamiento 2 noches, Todas las comidas, Guía naturalista, Actividades',
                'excludes' => 'Vuelos a Iquitos, Bebidas alcohólicas, Propinas',
                'requirements' => 'Vacuna fiebre amarilla, Repelente de insectos, Botas de jebe',
                'price' => 380.00,
                'discount_price' => 350.00,
                'duration_days' => 3,
                'duration_hours' => 0,
                'max_people' => 12,
                'min_people' => 2,
                'difficulty_level' => 'moderate',
                'location_city' => 'Iquitos',
                'location_region' => 'Loreto',
                'location_country' => 'Peru',
                'latitude' => -3.749914,
                'longitude' => -73.252891,
                'featured_image' => 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5',
                'rating' => 5.0,
                'total_reviews' => 78,
                'total_bookings' => 112,
                'is_featured' => true,
                'is_active' => true,
                'available_days' => [1, 3, 5],
            ],
        ];

        foreach ($tours as $tourData) {
            $tour = Tour::create($tourData);
            
            // Crear imágenes adicionales para cada tour
            TourImage::create([
                'tour_id' => $tour->id,
                'image_url' => $tourData['featured_image'],
                'alt_text' => $tour->title,
                'order' => 1,
                'is_primary' => true,
            ]);
        }

        $this->command->info('✅ Base de datos poblada exitosamente!');
        $this->command->info('📧 Admin: admin@bookandgo.com | password');
        $this->command->info('📧 Cliente: juan@example.com | password');
        $this->command->info('📧 Agencia: inca@bookandgo.com | password');
    }
}