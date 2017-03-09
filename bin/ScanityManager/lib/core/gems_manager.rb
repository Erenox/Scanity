# ./lib/gems_manager.rb
# installing missing public gems
# private core gems
require_relative './system_manager.rb'

class Gems

  def self.manage_gems(&block)
    yield
  rescue LoadError => e

    # get the gem name
    gem_name = e.message.split('--').last.strip

    # auto install the missing gem
    System.exec("auto installing the missing gem: #{gem_name}.","sudo gem install #{gem_name}","gem : #{gem_name} installed.","failed to install : #{gem_name} gem.")

    # retry
    Gem.clear_paths
    puts '[ OK ] - Trying again ...'
    require gem_name
    retry
  end

end
