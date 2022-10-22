Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # User Account related stuff
  post '/signup', to: 'users#create'
  post '/login', to: 'sessions#create'
  delete '/logout', to: 'sessions#destroy'
  get '/me', to: 'users#me'

  # Game Requests
  patch '/join/:game_id', to: 'users#join_game'
  patch '/leave/', to: 'users#leave_game'
  patch '/submit_card/:card_index', to: 'users#submit_card'
  patch '/pick_card/:card_index', to: 'users#pick_card'
  # lobby search/creation:
  resources :games, only: %i[index create]
  # lobby owner commands:
  patch '/start_game', to: 'users#start'
  # TODO: Kick player route
  # ! temp route, replace with server telling users the game state directly
  get '/game_state', to: 'users#game_state'
end
