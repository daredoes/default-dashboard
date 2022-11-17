# Default Dashboard by [@daredoes](https://www.github.com/daredoes)

Enforce a default dashboard on every device in Home Assistant!

  ![Default Dashboard Entity](/docs/imgs/default_dashboard_entity.png)

[![GitHub Release][releases-shield]][releases]
[![License][license-shield]](LICENSE.md)
[![hacs_badge](https://img.shields.io/badge/HACS-Custom-blue.svg)](https://github.com/custom-components/hacs)

![Project Maintenance][maintenance-shield]
[![GitHub Activity][commits-shield]][commits]

## Support

Hey you! Help me out for a couple of :beers: or a :coffee:!

[![coffee](https://www.buymeacoffee.com/assets/img/custom_images/black_img.png)](https://www.buymeacoffee.com/daredoes)

---

##  Features

* Select a dashboard that will become the default for all web users/devices (does not include mobile apps at this time)
* Update selected dashboard at any time

---

## Installation

1. Add through  [HACS](https://github.com/custom-components/hacs)
2. Create a dropdown helper called `Default Dashboard`. The entity id must be `input_select.default_dashboard`. Give it the option of "refresh", and select this option.
3. Reload the homepage. This will update the `Default Dashboard` helper to have all possible dashboards an options, with the option "enabled" selected.
4. Choose an option for the `Default Dashboard` helper.
5. Reload the home URL on mobile, and watch it set the default dashboard away from Overview


---


[commits-shield]: https://img.shields.io/github/commit-activity/y/daredoes/default-dashboard.svg
[commits]: https://github.com/daredoes/default-dashboard/commits/master
[devcontainer]: https://code.visualstudio.com/docs/remote/containers
[license-shield]: https://img.shields.io/github/license/daredoes/default-dashboard.svg
[maintenance-shield]: https://img.shields.io/maintenance/yes/2022
[releases-shield]: https://img.shields.io/github/release/daredoes/default-dashboard.svg
[releases]: https://github.com/daredoes/default-dashboard/releases
