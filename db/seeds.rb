puts '🗑️ Deleting old cards, packs, and categories'
BlackCard.delete_all
WhiteCard.delete_all
CardPack.delete_all
CardCategory.delete_all
# we are remaking the cards, so we don't want to keep references to them in older games
puts '🗑️ Deleting old games'
Game.delete_all
# we are deleting all the games, so don't want to keep references to them in users
users = User.all
progressbar = ProgressBar.create(title: '🗑️ Cleaning up old references in users', total: users.length)
users.each do |user|
  user.update(game_score: 0, hand: [], submitted_hand_index: nil, picked_card_index: nil, game_id: nil)
  progressbar.increment
end

begin
  puts "\n📁 Reading cards file"

  card_file = File.read('./cah-cards-full.json')
rescue Errno::ENOENT
  puts '❌ ./cah-cards-full.json not found!'
  puts 'Download it from https://crhallberg.com/cah/ '
else
  cards_json = JSON.parse(card_file)

  # threads = cards_json.map do |pack|
  cards_json.each do |pack|
    # Thread.new do
    # create the card pack
    card_pack = CardPack.create(title: pack['name'])

    # add cards to the pack
    puts "\n⌛ Loading cards from #{pack['name']}"

    if pack['white'].present?
      progressbar = ProgressBar.create(title: "  #{pack['white'].length} White cards", total: pack['white'].length)

      pack['white'].each do |card|
        WhiteCard.create(text: card['text'], card_pack: card_pack)
        progressbar.increment
      end
    end

    next if pack['black'].blank?

    progressbar = ProgressBar.create(title: "  #{pack['black'].length} Black cards", total: pack['black'].length)

    pack.black.each do |card|
      BlackCard.create(text: card.text, card_pack: card_pack, pick: card['pick']) if card['pick'] == 1
      # TODO: implement support for cards with card.pick > 1
      progressbar.increment
    end
    # end
  end

  # threads.each do |thread, i|
  #   sleep 0.5 while thread.alive?
  #   puts "finished thread #{i}"
  # end

  # make the categories
  puts "\n🌳 Making categories"
  categories_json = JSON.parse(File.read('./categories.json'))
  categories_json.each do |cat|
    category = CardCategory.create(title: cat['title'], is_official: cat['title'].include?('Official'))

    puts cat['title']
    # Add packs that match cat regex
    cat['regex'].each do |regex|
      CardPack.select { |pack| pack.title.downcase.match(regex.downcase) }.each do |pack|
        if pack.card_category_id.nil?
          puts "\t#{pack.title}"
          pack.update(card_category: category)
        end
      end
    end
  end
end
