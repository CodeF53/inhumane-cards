class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class

  # to pass in a lambada do set_timeout(lambda { puts "hello" }, 0.5)
  def set_timeout(callback:, seconds:)
    Thread.new do
      sleep seconds
      callback.call
    end
  end
end
