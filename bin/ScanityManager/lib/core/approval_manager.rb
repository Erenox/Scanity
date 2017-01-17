# ./lib/approval_manager.rb
# Ask user for important things
# Created by : Erenox the : 27/10/2016
# Last update : 20/12/2016

# private gems
require_relative('./string_overwrite.rb')

class Approval

  #<editor-fold desc="static method : ask(question)">
  def self.ask(question)

    print "#{question} [Y/N] : ".alert
    input = gets.chomp

    if input == 'Y' or input == 'y'
      return true

    elsif input == 'N' or input == 'n'
      puts "[ OK ] exit. \n".valid
      exit

    else
      puts ("[ ERROR ] - unknown parameter : #{input}, exit.").error
      exit
    end

  end
  #</editor-fold>

end
