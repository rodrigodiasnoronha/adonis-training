'use strict';

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');

/*
|--------------------------------------------------------------------------
|  Auth Routes
|--------------------------------------------------------------------------
|
*/

Route.post('/register', 'ProfileController.store').validator('Register');
Route.post('/login', 'AuthController.store').validator('Login');

/*
|--------------------------------------------------------------------------
|  Provider Route
|--------------------------------------------------------------------------
|
*/

Route.get('/verify_token', 'ProviderController.show').middleware('auth');

/*
|--------------------------------------------------------------------------
|  Reset pass routes
|--------------------------------------------------------------------------
|
*/
Route.post('/reset_password', 'ResetPasswordController.store').validator(
    'ResetPassword'
);

Route.put('/reset_password', 'ResetPasswordController.update').validator(
    'ChangePass'
);

/*
|--------------------------------------------------------------------------
|  Profile routes
|--------------------------------------------------------------------------
|
*/

Route.put('/profile', 'ProfileController.update').middleware('auth');
Route.get('/profiles', 'ProfileController.index').middleware('auth');

/*
|--------------------------------------------------------------------------
|  Tags routes
|--------------------------------------------------------------------------
|
*/
Route.get('/tags', 'TagController.index');

Route.get('/tags/:id', 'TagController.show');
Route.delete('/tags/:id', 'TagController.destroy').middleware('auth');

Route.post('/tags', 'TagController.store')
    .middleware('auth')
    .validator('TagStore');

Route.put('/tags/:id', 'TagController.update')
    .middleware('auth')
    .validator('TagUpdate');

/*
|--------------------------------------------------------------------------
|  Posts by tag routes
|--------------------------------------------------------------------------
|
*/

Route.get('/posts/tags', 'PostByTagController.index');

/*
|--------------------------------------------------------------------------
|  Posts routes
|--------------------------------------------------------------------------
|
*/

Route.get('/posts', 'PostController.index');

Route.get('/posts/alias/:alias', 'AliasPostController.show');

Route.get('/posts/:id', 'PostController.show');

Route.delete('/posts/:id', 'PostController.destroy').middleware('auth');

Route.put('/posts/:id', 'PostController.update')
    .middleware('auth')
    .validator('PostUpdate');

Route.post('/posts', 'PostController.store')
    .middleware('auth')
    .validator('Post');

/*
|--------------------------------------------------------------------------
|  News routes (or route)
|--------------------------------------------------------------------------
|
*/
Route.get('/news', 'NewsController.index');

/*
|--------------------------------------------------------------------------
|  Search routes (or route)
|--------------------------------------------------------------------------
|
*/
Route.get('/search', 'SearchController.index');

/*
|--------------------------------------------------------------------------
|  Static routes
|--------------------------------------------------------------------------
|
*/

Route.get('/files/:avatar', 'FileController.show');
