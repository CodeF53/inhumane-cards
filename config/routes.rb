Rails.application.routes.draw do
  resources :games
  resources :users
  resources :white_cards
  resources :black_cards
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
