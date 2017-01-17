# ./lib/system_manager.rb
# Normalise the system exec output
# Created by : Erenox the : 29/10/2016
# Last update : 31/10/2016

# private core gems
require_relative './string_overwrite.rb'


#CONST
AUDIT_PROCESSES = %w(phantomjs arachni nikto whatweb sslyze nmap joomlavs wpscan droopescan )

class System

  def self.exec(action, command ,str_out, str_err)
    puts "¤ #{action}"
    system("#{command}   > /dev/null 2>&1")

    if $? == 0
      puts ("[ OK ] - #{str_out}\n").valid
    else
      puts ("[ ERROR ] - #{str_err}\n").error
    end

  end


  def self.process_killer
    puts '¤ killing all remaining processes.'
    killed_process = 0

    AUDIT_PROCESSES.each do |process|

      if system("sudo pgrep #{process} > /dev/null") # if process running
          system("sudo killall -9 #{process} > /dev/null")
          puts "[ OK ] - process : #{process} killed.".valid
          killed_process += 1
      end

    end

    puts ("[ OK ] - #{killed_process.to_s}  processes have been killed. \n").valid

  end

end
