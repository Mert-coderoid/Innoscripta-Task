<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\ArticleController;
use App\Services\GuardianService;
use App\Services\NewsAPIService;
use App\Services\TimesService;
// ArticleController
use App\Services\ArticleLocationService;


class FetchArticles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'articles:fetch';


    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */

    public function __construct()
    {
        parent::__construct();
    }

    public function handle(): void
    {
        try {
            $articleController = new ArticleController();
            $articleController->fetchArticles( new NewsAPIService(), new TimesService(), new GuardianService() );
            $this->info('Articles fetched successfully');
        } catch (\Exception $e) {
            $this->error('Error fetching articles: ' . $e->getMessage());
        }

        try {
            $articleController = new ArticleController();
            $articleController->getLocations( new ArticleLocationService() );
            $this->info('Locations updated successfully');
        } catch (\Exception $e) {
            $this->error('Error updating locations: ' . $e->getMessage());
        }
    }

}
