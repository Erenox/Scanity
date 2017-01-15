# server_manager.rb
# The Scanity server manager panel.
# Created by : Erenox the : 28/10/2016
# Last update : 31/10/2016

# private core gems
require_relative './lib/core/options_parser'

# private processing gems
require_relative './lib/processing.rb'

class ServerManager

  #<editor-fold desc="class constructor : initialize">
  # class constructor
  def initialize(argv)
    my_options_parser = OptionsParser.new(argv)
    @my_processing = Processing.new(my_options_parser.parse)
  end
  #</editor-fold>

  #<editor-fold desc="method : processing">
  def processing
    @my_processing.run
  end
  #</editor-fold>

end

#<editor-fold desc="section : entry point">
my_server_manager = ServerManager.new(ARGV)
my_server_manager.processing
#</editor-fold>