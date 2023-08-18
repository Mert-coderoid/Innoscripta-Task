<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\ArticleController;
use App\Services\GuardianService;
use App\Services\NewsAPIService;
use App\Services\TimesService;


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
        $articleController = new ArticleController();
        $articleController->fetchArticles( new NewsAPIService(), new TimesService(), new GuardianService() );
        $this->info('Articles fetched successfully');
    }

}
