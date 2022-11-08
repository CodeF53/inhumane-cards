class AddEnableDiscardsToGames < ActiveRecord::Migration[7.0]
  def change
    add_column :games, :enable_discards, :boolean, default: false
  end
end
