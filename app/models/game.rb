class Game < ApplicationRecord
  has_many :users
  belongs_to :lobby_leader, class_name: 'User', foreign_key: 'lobby_leader_id'
  belongs_to :round_leader, class_name: 'User', foreign_key: 'round_leader_id'
  belongs_to :black_card
end
