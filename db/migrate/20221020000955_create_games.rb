class CreateGames < ActiveRecord::Migration[7.0]
  def change
    create_table :games do |t|
      t.integer :lobby_owner_id
      t.integer :card_czar_id
      t.string :game_phase
      t.integer :black_card_id
      t.integer :winning_score
      t.string :password
    end
  end
end
