class ApplicationController < ActionController::API
  rescue_from ActiveRecord::RecordInvalid, with: :invalid_record_response
  rescue_from ActiveRecord::RecordNotFound, with: :not_found_response

  private

  def invalid_record_response(invalid)
    render json: { errors: invalid.record.errors.full_messages }, status: :unprocessable_entity
  end

  def not_found_response(exception)
    render json: { error: "#{exception.model} not found" }, status: :not_found
  end
end
