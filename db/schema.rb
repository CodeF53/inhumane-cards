# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 5) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "black_cards", force: :cascade do |t|
    t.string "text"
    t.integer "pick", default: 1
    t.bigint "card_pack_id", null: false
    t.index ["card_pack_id"], name: "index_black_cards_on_card_pack_id"
  end

  create_table "card_categories", force: :cascade do |t|
    t.string "title"
    t.boolean "is_official"
  end

  create_table "card_packs", force: :cascade do |t|
    t.string "title"
    t.bigint "card_category_id"
    t.index ["card_category_id"], name: "index_card_packs_on_card_category_id"
  end

  create_table "games", force: :cascade do |t|
    t.integer "winning_score"
    t.integer "player_limit"
    t.boolean "enable_discards", default: false
    t.string "password"
    t.integer "lobby_owner_id"
    t.integer "black_card_id"
    t.integer "card_czar_id"
    t.string "game_phase", default: "lobby"
    t.json "black_card_pool", default: [], array: true
    t.json "white_card_pool", default: [], array: true
    t.integer "used_white_card_ids", default: [], array: true
    t.integer "used_black_card_ids", default: [], array: true
  end

  create_table "users", force: :cascade do |t|
    t.string "username"
    t.string "password_digest"
    t.integer "game_id"
    t.integer "game_score"
    t.integer "submitted_hand_index"
    t.integer "picked_card_id"
    t.integer "discarded_card_index"
    t.integer "last_ping"
    t.integer "last_input"
    t.json "hand", default: [], array: true
  end

  create_table "white_cards", force: :cascade do |t|
    t.string "text"
    t.bigint "card_pack_id", null: false
    t.index ["card_pack_id"], name: "index_white_cards_on_card_pack_id"
  end

  add_foreign_key "black_cards", "card_packs"
  add_foreign_key "card_packs", "card_categories"
  add_foreign_key "white_cards", "card_packs"
end
