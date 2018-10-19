/**
 * SettingController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getAllSetting: async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (req.param('is_active') === 'true') {

      let settings = await Setting.find({
        where: { is_active: true },
        limit: 1,
      });
      return res.json(settings[0])
    }
    let settings = await Setting.find();
    return res.json(settings)
  },

  getActiveSetting: async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');


  },

  postSetting: async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    let body = req.body;
    let theme_options = {
      title_color: body.title_color,
      background_color: body.background_color,
      action_color: body.action_color,
      content_color: body.content_color
    }

    let display_option = {
      display_time: parseInt(body.display_time),
      delay_time: parseInt(body.delay_time),
      is_show_mobile: body.is_show_mobile,
      mobile_position: parseInt(body.mobile_position),
      desktop_position: parseInt(body.desktop_position)
    }

    let setting = {
      theme_options: theme_options,
      display_option: display_option,
      is_active: body.is_active,
      type: body.type
    }

    let paramType = req.param('type');
    if (paramType === 'custom' || paramType === 'basic' ) {

      await Setting.update({ type: body.type })
        .set({
          theme_options: theme_options,
          display_option: display_option,
          is_active: body.is_active,
        });
      return res.json({ status: '201 created' })
    } else {
      await Setting.findOrCreate({ type: setting.type }, setting)
      return res.json({ status: '201 created' })
    }


  },

  putSetting: async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    let body = req.body;
    let theme_options = {
      title_color: body.title_color,
      background_color: body.background_color,
      action_color: body.action_color,
      content_color: body.content_color
    }

    let display_option = {
      display_time: parseInt(body.display_time),
      delay_time: parseInt(body.delay_time),
      is_show_mobile: body.is_show_mobile,
      mobile_position: parseInt(body.mobile_position),
      desktop_position: parseInt(body.desktop_position)
    }

    await Setting.update({ type: body.type })
      .set({
        theme_options: theme_options,
        display_option: display_option,
        is_active: body.is_active,
      });

    return res.json({ status: '201 created' })


  }

};

