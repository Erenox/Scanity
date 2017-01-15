# ./lib/banner_display.rb
# Contains manager banners
# Created by : Erenox the : 27/10/2016
# Last update : 1/11/2016

# private core gems
require_relative './string_overwrite.rb'
require_relative './services_manager.rb'


class Banner

  #<editor-fold desc="class constructor : initialize">
  # class constructor
  attr_accessor :type, :version, :codename, :reset # : optional parameters
  def initialize(type = 'shadow', version = '2.1.0', codename = 'Jackson (Beta)', reset = true)
    @reset = reset
    @type = type
    @version = version
    @codename = codename
    # stats :
      # (20/12/2015) version : 1.x.x codename : Murdock
      # (31/11/2016) version : 2.0.0 codename : Perens
      # (23/12/2016) version : 2.1.0 codename : Jackson
    # Debian project leaders : https://fr.wikipedia.org/wiki/Debian#Chefs_du_projet_Debian_.28Debian_project_leaders.29

    # get services status
    @services = Services.get_all_status

  end
  #</editor-fold>

  #<editor-fold desc="method : display_banner">
  # display the banner
  def display_banner
    if @reset
      print "\033c" # clear the console
    end
    self.send(type) # display the banner by type
    puts "Server manager version : #{@version} - #{@codename}" # display the sub-banner

    # display state of services
    print '¤ node.js service : '
    if @services['nodejs']
      print '[active] '.valid
    else
      print '[inactive] ' .error
    end

    print '¤ mongodb service : '
    if @services['mongodb']
      print '[active] '.valid
    else
      print '[inactive] '.error
    end

    puts "\n\n"

  end
  #</editor-fold>

  #<editor-fold desc="section : banners">
  def shadow
    puts '███████╗ ██████╗ █████╗ ███╗   ██╗██╗████████╗██╗   ██╗    ███████╗███████╗██████╗ ██╗   ██╗███████╗██████╗ '
    puts '██╔════╝██╔════╝██╔══██╗████╗  ██║██║╚══██╔══╝╚██╗ ██╔╝    ██╔════╝██╔════╝██╔══██╗██║   ██║██╔════╝██╔══██╗'
    puts '███████╗██║     ███████║██╔██╗ ██║██║   ██║    ╚████╔╝     ███████╗█████╗  ██████╔╝██║   ██║█████╗  ██████╔╝'
    puts '╚════██║██║     ██╔══██║██║╚██╗██║██║   ██║     ╚██╔╝      ╚════██║██╔══╝  ██╔══██╗╚██╗ ██╔╝██╔══╝  ██╔══██╗'
    puts '███████║╚██████╗██║  ██║██║ ╚████║██║   ██║      ██║       ███████║███████╗██║  ██║ ╚████╔╝ ███████╗██║  ██║'
    puts '╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝      ╚═╝       ╚══════╝╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝'
  end

  def slant
    puts '   _____                  _ __           _____                            '
    puts '  / ___/_________ _____  (_) /___  __   / ___/___  ______   _____  _____  '
    puts '  \__ \/ ___/ __ `/ __ \/ / __/ / / /   \__ \/ _ \/ ___/ | / / _ \/ ___/  '
    puts ' ___/ / /__/ /_/ / / / / / /_/ /_/ /   ___/ /  __/ /   | |/ /  __/ /      '
    puts '/____/\___/\__,_/_/ /_/_/\__/\__, /   /____/\___/_/    |___/\___/_/       '
    puts '                            /____/                                        '
  end

  def cyber_medium
    puts '____ ____ ____ _  _ _ ___ _   _    ____ ____ ____ _  _ ____ ____  '
    puts '[__  |    |__| |\ | |  |   \_/     [__  |___ |__/ |  | |___ |__/  '
    puts '___] |___ |  | | \| |  |    |      ___] |___ |  \  \/  |___ |  \  '
  end


  def js_stick
    puts ' __   __              ___         __   ___  __        ___  __   '
    puts '/__` /  `  /\  |\ | |  |  \ /    /__` |__  |__) \  / |__  |__)  '
    puts '.__/ \__, /~~\ | \| |  |   |     .__/ |___ |  \  \/  |___ |  \  '
  end

  def rounded
    puts '   ______                   _                 ______                                '
    puts '  / _____)                 (_)  _            / _____)                               '
    puts ' ( (____   ____ _____ ____  _ _| |_ _   _   ( (____  _____  ____ _   _ _____  ____  '
    puts '  \____ \ / ___|____ |  _ \| (_   _) | | |   \____ \| ___ |/ ___) | | | ___ |/ ___) '
    puts '  _____) | (___/ ___ | | | | | | |_| |_| |   _____) ) ____| |    \ V /| ____| |     '
    puts ' (______/ \____)_____|_| |_|_|  \__)\__  |  (______/|_____)_|     \_/ |_____)_|     '
    puts '                                    (____/                                          '
  end

  def stick_letters
    puts ' __   __              ___         __   ___  __        ___  __  '
    puts '/__` /  `  /\  |\ | |  |  \ /    /__` |__  |__) \  / |__  |__) '
    puts '.__/ \__, /~~\ | \| |  |   |     .__/ |___ |  \  \/  |___ |  \ '
  end

  def straight
    puts ' __                __             '
    puts '(_  _ _  _ .|_    (_  _ _   _ _   '
    puts '__)(_(_|| )||_\/  __)(-| \/(-|    '
    puts '              /                   '
  end
  #</editor-fold>

end