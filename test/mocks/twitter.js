/* Exported functions. */
module.exports = {
  _createTweet: createTweet
};

function createTweet({
  id = -1,
  id_str = '-1',
  user_screen_name = 'None',
  in_reply_to_screen_name = 'None',
  in_reply_to_status_id = -1,
  in_reply_to_status_id_str = '-1',
  tweet_user_id = -1,
  tweet_user_id_str = '-1',
  tweet_user_screen_name = 'None',
  full_text = 'Default tweet.',
  display_text_range = []
}) {
  return {
    id: id,
    id_str: id_str,
    user_screen_name: user_screen_name,
    in_reply_to_screen_name: in_reply_to_screen_name,
    in_reply_to_status_id: in_reply_to_status_id,
    in_reply_to_status_id_str: in_reply_to_status_id_str,
    full_text: full_text,
    display_text_range: display_text_range,
    user: {
      id: tweet_user_id,
      id_str: tweet_user_id_str,
      screen_name: user_screen_name
    }
  }
}

