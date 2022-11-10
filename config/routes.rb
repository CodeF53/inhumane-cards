Rails.application.routes.draw do
  # ActionCable Magic
  mount ActionCable.server => '/cable'

  # User Account related stuff
  post '/signup', to: 'users#create'
  post '/login', to: 'sessions#create'
  delete '/logout', to: 'sessions#destroy'
  get '/me', to: 'users#me'

  # Game Requests
  patch '/join/:game_id', to: 'users#join_game'
  patch '/leave/', to: 'users#leave_game'
  patch '/submit_card/:card_index', to: 'users#submit_card'
  patch '/discard_card/:card_index', to: 'users#discard_card'
  patch '/pick_card/:card_index', to: 'users#pick_card'

  get '/hand/', to: 'users#hand'
  get '/games/:game_id', to: 'games#state'
  # lobby search/creation:
  resources :games, only: %i[index create]
  # lobby owner commands:
  patch '/start_game', to: 'users#start'
  post '/kick/:user_id', to: 'users#kick'
  post '/promote/:user_id', to: 'users#promote'

  resources :card_categories, only: [:index]

  get '*path', to: 'fallback#index', constraints: ->(req) { !req.xhr? && req.format.html? }
  get '/', to: 'fallback#index'
end
