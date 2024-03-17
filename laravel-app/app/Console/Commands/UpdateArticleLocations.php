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
        $service = new ArticleLocationService();
        $service->updateArticleLocations();
        $this->info('Article locations updated successfully.');
    }
}
