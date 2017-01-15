# ./lib/string_overwrite.rb
# Overwrite the standard String class
# Created by : Erenox the : 28/10/2016
# Last update : 28/10/2016

#(overwriting String class)Thanks to Ivan Black
class String

  # Prototype String.error, String.valid
  def error;          "\033[31m#{self}\033[0m" end # display output in red
  def valid;          "\033[32m#{self}\033[0m" end # display output in green
  def alert;          "\033[34m#{self}\033[0m" end # display output in blue

end