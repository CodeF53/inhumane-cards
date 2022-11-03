class CardCategoriesController < ApplicationController
  skip_before_action :authorize

  # GET /card_categories
  def index
    @card_categories = CardCategory.all

    render json: @card_categories
  end
end
