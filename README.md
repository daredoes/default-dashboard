# Default Dashboard by [@daredoes](https://www.github.com/daredoes)

Enforce a default dashboard on every device in Home Assistant!

[![GitHub Release][releases-shield]][releases]
[![License][license-shield]](LICENSE.md)
[![hacs_badge](https://img.shields.io/badge/HACS-Custom-blue.svg)](https://github.com/custom-components/hacs)

![Project Maintenance][maintenance-shield]
[![GitHub Activity][commits-shield]][commits]

## Support

Hey you! Help me out for a couple of :beers: or a :coffee:!

[![coffee](https://www.buymeacoffee.com/assets/img/custom_images/black_img.png)](https://www.buymeacoffee.com/daredoes)

---

## Features

* Select a dashboard that will become the default for all users/devices
* Update selected dashboard at any time
* Retain a per-device default dashboard by loading the home page first (this loads the module), then going to the dashboards tab, and setting the desired default dashboard on the device.

---

## Installation

1. Add through  [HACS](https://github.com/custom-components/hacs)
  ![Install Via HACS](/docs/imgs/HacsInstall.gif)
2. Create a dropdown helper called `Default Dashboard`. The entity id must be `input_select.default_dashboard`. Give it the option of "refresh", and select this option.
  ![Add Dropdown Helper](/docs/imgs/AddDropdownHelper.gif)
3. Create a toggle helper called `Default Dashboard`. The entity id must be `input_boolean.default_dashboard`. Save it, and leave it disabled.
  ![Add Toggle Helper](/docs/imgs/AddToggleHelper.gif)
4. Reload the homepage. This will update the `Default Dashboard` helper to have all possible dashboards an options, with the option "lovelace" selected.
5. Choose an option for the `Default Dashboard` dropdown helper, and enable the toggle helper.
6. Reload the home URL, and watch it set the default dashboard away from Overview

---

[commits-shield]: https://img.shields.io/github/commit-activity/y/daredoes/default-dashboard.svg
[commits]: https://github.com/daredoes/default-dashboard/commits/master
[devcontainer]: https://code.visualstudio.com/docs/remote/containers
[license-shield]: https://img.shields.io/github/license/daredoes/default-dashboard.svg
[maintenance-shield]: https://img.shields.io/maintenance/yes/2022
[releases-shield]: https://img.shields.io/github/release/daredoes/default-dashboard.svg
[releases]: https://github.com/daredoes/default-dashboard/releases
