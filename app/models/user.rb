class User < ApplicationRecord
  # makes hand an array somehow
  # https://joecastronovo.medium.com/how-to-add-an-array-column-to-sqlite3-table-662037d49b64
  serialize :hand
  after_initialize do |u|
    u.hand = [] if u.hand.nil?
  end
end
