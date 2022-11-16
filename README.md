# Linked Lovelace by [@daredoes](https://www.github.com/daredoes)

![Linked Lovelace Demo](/docs/imgs/LinkedLoveLace.gif)

A Javascript/Websocket way to do templating in the Lovelace UI

[![GitHub Release][releases-shield]][releases]
[![License][license-shield]](LICENSE.md)
[![hacs_badge](https://img.shields.io/badge/HACS-Default-blue.svg)](https://github.com/custom-components/hacs)

![Project Maintenance][maintenance-shield]
[![GitHub Activity][commits-shield]][commits]

## Support

Hey you! Help me out for a couple of :beers: or a :coffee:!

[![coffee](https://www.buymeacoffee.com/assets/img/custom_images/black_img.png)](https://www.buymeacoffee.com/daredoes)

---

##  Features

* Create cards in the Lovelace UI that can be **linked** to multiple dashboards
* Provide *basic* templating when creating linked cards

---

## Installation

Add through  [HACS](https://github.com/custom-components/hacs)

---

## Options

| Name              | Type    | Requirement  | Description                                 | Default             |
| ----------------- | ------- | ------------ | ------------------------------------------- | ------------------- |
| type              | string  | **Required** | `custom:linked-lovelace-ui`                   |
| name              | string  | **Optional** | Card name                                   | ``       |

## Templates

---

### Creating a template dashboard

The first thing needed when creating a template card is a dashboard to hold these templates.

Create a dashboard inside of Hassio at `http://YOUR_INSTANCE.local:8123/config/lovelace/dashboards`

   ![Add New Dashboard](/docs/imgs/LovelaceDashboards.png)

For our example, we'll create a `Templates` dashboard with the path `lovelace-templates`. The settings here don't really matter, it only matters that we have a dashboard.

   ![Add Template Dashboard](/docs/imgs/AddNewDashboard.png)

1. On the `Templates` dashboard, click the `⋮` to access a menu, and click `Edit Dashboard`.

   ![Edit Dashboard](/docs/imgs/EditDashboard.png)
2. Once again, click the `⋮` to access another menu, and click `Raw configuration editor`.

   ![Edit Dashboard Header](/docs/imgs/RawConfigurationEditorMenu.png)
3. Add `template: true` to the top of the configuration file

   ![Configuration](/docs/imgs/Configuration.png)

That's it! Any view in this dashboard that has exactly one card in it will now be converted into a template.

#### **Remember, the path of each view in the dashboard will be the name of the template.**

### What is a template?

> A template is a 'view' that contains exactly one 'card'. The 'path' of the view determines the 'key' we use to identify the template in other cards.

### What can be in a template?

So, *amateur hour here*, a template can be any valid card, where any term surrounded by the `$` character can be used as a key for replacement.

How does data make it into the template to be replaced? `template_data` *duh?*

Need an example? Okay!

First, we'll create a view called `Version Card` with the path `version-card`.

Next, we'll make a card that has a version in the bottom-right corner. Create a new card, and throw this YAML into it.

```yaml
type: custom:mushroom-template-card
primary: ''
secondary: $version$
icon: ''
badge_icon: ''
badge_color: ''
fill_container: false
layout: horizontal
multiline_secondary: false
tap_action:
  action: none
hold_action:
  action: none
double_tap_action:
  action: none
card_mod:
  style: |
    ha-card.type-custom-mushroom-template-card {
      background-color: rgba(0,0,0,0);
      text-align: right;
      padding-top: 0px;
      margin-top: -26px;
      z-index: 0;
    }
```

Now, let's use that `version-card` in something! How about another template!?

First, we'll create a view called `Update Button` with the path `update-button`.

Next, we'll make a card that contains a vertical stack, with the button and our version as the two elements in the stack.

Here's the YAML

```yaml
type: vertical-stack
cards:
  - type: vertical-stack
    cards:
      - type: custom:linked-lovelace-ui
  - type: custom:mushroom-template-card
    template_data:
      version: v0.0.1
    template: version-card
```

![Broken Template Card](/docs/imgs/BrokenTemplate.png)

Wait, that doesn't look like a very useful card. Maybe it'll be more useful once we render it. Save the card, and then click it! You may be prompted to refresh the page, if not, refresh anyways since the changes won't appear until we do.

Click edit, and look that that filled in YAML.

```yaml
type: vertical-stack
cards:
  - type: vertical-stack
    cards:
      - type: custom:linked-lovelace-ui
  - type: custom:mushroom-template-card
    primary: ''
    secondary: v0.0.1
    icon: ''
    badge_icon: ''
    badge_color: ''
    fill_container: false
    layout: horizontal
    multiline_secondary: false
    tap_action:
      action: none
    hold_action:
      action: none
    double_tap_action:
      action: none
    card_mod:
      style: |
        ha-card.type-custom-mushroom-template-card {
          background-color: rgba(0,0,0,0);
          text-align: right;
          padding-top: 0px;
          margin-top: -26px;
          z-index: 0;
        }
    template_data:
      version: v0.0.1
    template: version-card
```

![Working Template Card](/docs/imgs/WorkingTemplate.png)

The main takeaway here is where `template_data`, `version`, and `$version$` are used.

#### **Card Using Template**

```yaml
template: version-card
template_data:
    version: v0.0.1
```

#### **Card Using Template Data**

```yaml
type: custom:mushroom-template-card
secondary: $version$
```


[commits-shield]: https://img.shields.io/github/commit-activity/y/daredoes/linked-lovelace-ui.svg
[commits]: https://github.com/daredoes/linked-lovelace-ui/commits/master
[devcontainer]: https://code.visualstudio.com/docs/remote/containers
[license-shield]: https://img.shields.io/github/license/daredoes/linked-lovelace-ui.svg
[maintenance-shield]: https://img.shields.io/maintenance/yes/2022
[releases-shield]: https://img.shields.io/github/release/daredoes/linked-lovelace-ui.svg
[releases]: https://github.com/daredoes/linked-lovelace-ui/releases
