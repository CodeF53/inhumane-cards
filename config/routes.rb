Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # lobby search/creation:
  resources :games, only: [:index]

  # User Account related stuff
  post '/signup', to: 'users#create'
  post '/login', to: 'sessions#create'
  delete '/logout', to: 'sessions#destroy'
  get '/me', to: 'users#show'

  # Game Requests
  patch '/join/:game_id', to: 'users#join_game'
  patch '/leave/', to: 'users#leave_game'
  patch '/choose_card/:card_index', to: 'users#choose_card'
  patch '/pick_card/:card_index', to: 'users#pick_card'

  # TODO: Start game route
  # TODO: Kick player route

  get '/game_state', to: 'game#show'
end
