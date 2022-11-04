every '@reboot' do
  command 'source /home/f53/.rvm/scripts/rvm && cd /home/f53/inhumane-cards && bundle exec rails s -b 0.0.0.0 -p 3000 -e production -d &'
end