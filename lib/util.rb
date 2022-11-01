module Util
  # set_timeout(callback: -> { puts 'hello' }, seconds: 0.5)
  def self.set_timeout(callback:, seconds:)
    Thread.new do
      sleep seconds
      callback.call
    end
  end
end
