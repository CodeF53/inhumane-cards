class CreateGames < ActiveRecord::Migration[7.0]
  def change
    create_table :games do |t|
      t.integer :lobby_owner_id
      t.integer :card_czar_id
      t.string :game_phase, default: 'lobby'
      t.integer :black_card_id
      t.integer :winning_score
      t.string :password
      t.integer :player_limit
    end
  end
end
