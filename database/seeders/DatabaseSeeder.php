<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->command->info('🚀 Iniciando proceso de seeders...');
        
        // Orden importante para respetar relaciones
        $this->call([
            SystemSettingsSeeder::class,
            UsersAndAgenciesSeeder::class,
            CategoriesSeeder::class,
            ToursSeeder::class,
            BookingsSeeder::class,
            ReviewsSeeder::class,
            CouponsSeeder::class,
        ]);
        
        $this->command->info('✅ ¡Seeders completados exitosamente!');
        $this->command->newLine();
        $this->command->info('📧 Credenciales de acceso:');
        $this->command->table(
            ['Rol', 'Email', 'Password'],
            [
                ['Admin', 'admin@bookandgo.com', 'password'],
                ['Agencia 1', 'inca@bookandgo.com', 'password'],
                ['Agencia 2', 'perumagico@bookandgo.com', 'password'],
                ['Agencia 3', 'amazonia@bookandgo.com', 'password'],
                ['Cliente 1', 'juan@example.com', 'password'],
                ['Cliente 2', 'maria@example.com', 'password'],
            ]
        );
    }
}