class CardCategoriesController < ApplicationController
  # GET /card_categories
  def index
    @card_categories = CardCategory.all

    render json: @card_categories
  end
end
