# ./lib/processing/server.rb
# Processing the updates

class Update

  #<editor-fold desc="static method : update_server">
  def self.update_server

    # clean the npm cache
    System.exec('clean the npm cache.', 'sudo npm cache clean -f', 'npm cache cleaned.', 'failed to clean node.js cache.')

    # upgrade to latest version of node.js
    System.exec('upgrade to latest version of node.js.', 'sudo npm install -g n', 'node.js upgraded.','failed to upgrade node.js.')

    # config latest version of node.js
    System.exec('config latest version of node.js.', 'sudo n stable', 'node.js configured.', 'fail to configure node.js.')

    # update npm global modules
    System.exec('update npm global modules.','sudo npm update -g', 'npm global modules updated.', 'Fail to update npm global modules.')

  end
  #</editor-fold>

  #<editor-fold desc="static method : update_system_packages">
  def self.update_system_packages

    # get the update from repositories
    System.exec('get updates from repositories.','sudo apt-get update', 'repositories are updated.', 'failed to update repositories')

    # upgrade ParrotSec system packages
    System.exec('upgrade ParrotSec system packages.', 'sudo apt-get -y upgrade --allow-unauthenticated --allow-downgrades --allow-remove-essential --allow-change-held-packages', 'system packages upgraded.', 'failed to upgrade system packages.')

  end
  #</editor-fold>

  #<editor-fold desc="static method : update_system_core">
  def self.update_system_core

    # get the update from repositories
    System.exec('get updates from repositories.','sudo apt-get update', 'repositories are updated.', 'failed to update repositories')

    # upgrade ParrotSec system core
    System.exec('upgrade ParrotSec system core.', 'sudo apt-get -y dist-upgrade --allow-unauthenticated --allow-downgrades --allow-remove-essential --allow-change-held-packages', 'system core upgraded.', 'failed to upgrade system core.')

  end
  #</editor-fold>

end