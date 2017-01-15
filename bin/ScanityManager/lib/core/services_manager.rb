# ./lib/services_manager.rb
# Manage services (node.js, mongodb, ...)
# Created by : Erenox the : 28/10/2016
# Last update : 28/10/2016


class Services

  # services array
  @services = {'mongodb' => false, 'nodejs' => false}

  #<editor-fold desc="method : update_status">
  def self.update_status
    if system("ps -aux | pgrep 'mongod' > /dev/null ")
        @services['mongodb'] = true
      else
        @services['mongodb'] = false
      end

      if system("ps -aux | pgrep 'node' > /dev/null ")
        @services['nodejs'] = true
      else
        @services['nodejs'] = false
      end
  end
  #</editor-fold>

  #<editor-fold desc="getters: @services">
  def self.get_mongodb_status
    update_status
    @services['mongodb'] # return value
  end

  def self.get_nodejs_status
    update_status
    @services['nodejs'] # return value
  end

  def self.get_all_status
    update_status
    @services # return value
  end
  #</editor-fold>

end