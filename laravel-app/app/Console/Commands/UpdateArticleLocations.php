<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\ArticleLocationService;

class UpdateArticleLocations extends Command
{
    protected $signature = 'articles:update-locations';
    protected $description = 'Updates articles with location and coordinate information';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        try {
            $service = new ArticleLocationService();
            $result = $service->updateArticleLocations();
            if ($result) {
                $this->info('Locations updated successfully');
            } else {
                $this->info('No articles to update');
            }
        } catch (\Exception $e) {
            $this->error('Error updating article locations: ' . $e->getMessage());
        }
    }
}
