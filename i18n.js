/* ---------- Internationalization (i18n): English & Khmer ----------
   Loaded in <head> so the saved language applies before initial paint. */
(() => {
  const KEY = 'vla_lang';

  const DICT = {
    en: {
      // Header
      app_title: 'Auli',
      app_desc: 'Add values to hospital Value Lists in bulk. Existing values are skipped.',
      lang_btn_title_en: 'ប្តូរជាភាសាខ្មែរ (Switch to Khmer)',
      lang_btn_title_km: 'Switch to English (ប្តូរជាភាសាអង់គ្លេស)',
      settings_btn_title: 'Settings: speed, EMR data',
      settings_btn_aria: 'Settings',
      settings_btn_close: 'Close settings',
      theme_btn_dark: 'Switch to dark mode',
      theme_btn_light: 'Switch to light mode',

      // Current page
      page_status_label: 'Current page',
      page_checking: 'Checking…',
      page_not_valuelist: 'Not a Value List page',
      page_valuelist: 'Value List · {type}',
      page_hint_bad: 'Go to Hospital › Value List in the hospital system and open a list.',
      page_not_ready: 'The page is not ready.',
      page_reload_retry: '{error} Reload the page and try again.',
      page_could_not_work: 'Could not work with this page.',

      // Shared setting
      emr_desc_label: 'Name / description for EMR values',
      opt_desc_none: 'English name only',
      opt_desc_khmer: 'Khmer name only',
      opt_desc_en: 'English name | English description',
      opt_desc_khmer_en: 'English name | Khmer - English description',
      opt_desc_code: 'English name | Code',

      // Tabs
      tab_sync: 'Sync all',
      tab_single: 'One by one',

      // Mode 1: Sync all
      sync_intro: "Fill every list on this page from the EMR standard. Lists with the same name as an EMR group are found automatically. Untick anything you don't want, then create.",
      matched_lists: 'Matched lists',
      uncheck_all: 'Uncheck all',
      check_all: 'Check all',
      sync_empty_info: 'Open a Value List page to find lists that match the EMR groups.',
      sync_btn_create: 'Create all matched',
      sync_looking: 'Looking for matching lists…',
      sync_open_page_hint: 'Open a Value List page in this tab. Lists that match an EMR group will appear here.',
      sync_matched_count: '{matches} of {total} lists on this page match an EMR group.',
      sync_none_matched: 'None of the {total} lists on this page match an EMR group. Try another tab (Medical Record, Examination…), or use "One by one".',
      sync_row_values: '{n} / {total} values · {group}',
      sync_hide_values: 'Hide values',
      sync_choose_values: 'Choose which values to create',
      sync_create_in_lists_ask: 'Create values in {count} {lists}?',
      sync_up_to_values: 'Up to {count} {values}:',
      sync_creating_list_n: 'Creating list {current} of {total}: {label}…',
      sync_page_timeout: 'The list page did not load in time. Run again to retry; existing values are skipped.',
      sync_stopped: 'Stopped before finishing.',
      sync_stopped_detail: '{error} Values created so far are kept. Run again to finish; existing values are skipped.',

      // Mode 2: One by one
      single_intro: 'Add values to the list that is open in this tab.',
      emr_group_label: '1. EMR group',
      optional: '(optional)',
      emr_update_link: 'Update EMR data',
      emr_update_title: 'Download the latest values from emr-doc.pmrs2.org',
      values_label: '2. Values',
      values_count: '{n} {values}',
      values_placeholder: 'One value per line, for example:\nFever\nHeadache | Pain in the head',
      values_help: 'Put each value on its own line. To add a description, use <code>Name | Description</code>.',
      btn_check: 'Check',
      btn_check_title: 'See which values are new, without creating anything',
      btn_create: 'Create values',
      val_err_empty: 'Enter at least one value, one per line, or pick an EMR group above.',
      not_val_page_title: 'This tab is not a Value List page.',
      not_val_page_detail: 'In the hospital system go to Hospital › Value List, open a list, then try again.',
      create_values_ask: 'Create {count} {values}?',
      note_skip_exist: 'Values that already exist will be skipped.',
      note_wait_delay: 'Waits {delay} between values ({estimate} in total).',
      creating_values_busy: 'Creating {count} {values}…',
      checking_values_busy: 'Checking existing values…',
      waiting_delay_busy: 'Waiting {delay} between values. Keep this tab open until it finishes.',

      // Settings
      back_btn: 'Back',
      back_btn_title: 'Back to Sync all / One by one',
      settings_title: 'Settings',
      settings_general: 'General',
      setting_lang_label: 'Language / ភាសា',
      settings_creating: 'Creating',
      wait_between_values: 'Wait between values',
      seconds_unit: 'seconds',
      delay_help: "Pause after each value is created, and between lists in \"Sync all\". Minimum and default: 2 seconds, which keeps Auli under the hospital system's rate limit. Increase it if you see \"Too many requests\" or values fail to save. Maximum 60.",
      delay_err_min: "The minimum is {min} seconds. Less than that can go over the hospital system's rate limit.",
      delay_err_range: 'Enter a number of seconds from {min} to {max}.',
      settings_emr_data: 'EMR data',
      emr_data_intro: 'The EMR values used by "Sync all" and "One by one". Export them, edit or add values in Excel, then import the file back.',
      current_data_label: 'Current data',
      io_export_head: '1. Export',
      io_export_help: 'Download the current values to edit them.',
      io_export_csv: 'Export CSV',
      io_export_csv_title: 'Opens in Excel or Google Sheets',
      io_export_json: 'JSON',
      io_export_json_title: 'For developers / backups',
      io_import_head: '2. Import',
      io_import_help: 'Choose your edited .csv or .json file. It replaces the current values.',
      io_import_btn: 'Import file…',
      sheet_label: 'Team Google Sheet <small>edit together, sync live</small>',
      sheet_placeholder: 'https://docs.google.com/spreadsheets/d/…',
      sheet_sync_btn: 'Sync now',
      sheet_auto_label: 'Keep in sync (checks every 30 seconds while Auli is open)',
      sheet_status_help: 'Same columns as the CSV export. Share the sheet as <b>Anyone with the link: Viewer</b>, then paste its link.',
      sheet_paste_link_err: 'Paste a Google Sheets link (https://docs.google.com/spreadsheets/…).',
      sheet_reading: 'Reading the Google Sheet…',
      sheet_net_err: 'Could not reach Google Sheets. Check your internet connection.',
      sheet_share_err: 'Google did not share this sheet. In the sheet, click Share › General access › "Anyone with the link" (Viewer), then sync again.',
      sheet_empty_err: 'The sheet has no values. Add rows with a group and an english name.',
      sheet_problems_err: 'The sheet has problems, so your current data was kept: {errors}',
      sheet_synced_ok: 'Synced at {time}: {groups} groups, {values} values.',

      // Guide
      guide_summary: 'How to edit EMR data',
      guide_step1: 'Click <b>Export CSV</b> and open the file in Excel or Google Sheets.',
      guide_step2: 'Edit it. <b>One row = one value.</b> Rows with the same <code>group</code>, <code>page</code> and <code>section</code> form one list.',
      guide_step2_change: '<b>Change</b> a value: edit the cell.',
      guide_step2_add_val: '<b>Add a value</b>: add a row and copy the group, page and section from a row of that list.',
      guide_step2_add_grp: '<b>Add a group</b>: add rows with a new group name.',
      guide_step2_del_val: '<b>Remove</b> a value: delete its row. Duplicate names in the same list (ignoring capitals) are skipped.',
      guide_step3: 'Save as <b>CSV UTF-8</b> (Excel: File › Save As › "CSV UTF-8"), so Khmer text is kept. Files that use <code>;</code> instead of <code>,</code> also work.',
      guide_step4: 'Click <b>Import file…</b>, choose it and confirm. It <b>replaces all current EMR data</b>, so export first if you want a backup. If something is wrong, you\'ll see the row number and nothing changes.',
      cols_caption: 'Columns',
      col_group_desc: '<b>Required.</b> Group name. Use the same name as the list in the hospital system (e.g. <i>Birth Control Type</i>) so "Sync all" can match it.',
      col_code_desc: 'Code (optional; e.g. <i>OBVA-S000099</i>). If empty, the English name is used.',
      col_english_desc: '<b>Required.</b> English name of the value (e.g. <i>Combined Oral Contraceptive (COC)</i>).',
      col_khmer_desc: 'Khmer name (optional; e.g. <i>ថ្នាំគ្រាប់ស៊ីអូស៊ី</i>). Created instead of the English name when "Khmer name only" is chosen.',
      col_desc_desc: 'Longer English description (optional).',
      col_page_desc: 'Groups lists in the group picker (optional; "Custom" if empty). The same group name under a different page or section becomes a separate list.',
      guide_team_sheet: '<b>Team Google Sheet:</b> in Google Sheets, File › Import › upload the exported CSV. Click Share › General access › <b>Anyone with the link</b> (Viewer), or use File › Share › Publish to web. Paste the sheet link above and turn on <b>Keep in sync</b>. Your team edits the sheet; while Auli is open it picks up changes within 30 seconds. Use the tab the link points to (the <code>#gid=</code> part). If a row has a problem, the current data is kept until it is fixed. Importing a file or resetting turns <b>Keep in sync</b> off.',
      guide_example: 'Example:',
      guide_setting_note: 'Whether the English or Khmer name is created, and which description, is set by "Name / description for EMR values" on the main screen. To undo all changes, use <b>Reset to built-in data</b>.',
      io_update_btn: 'Update from emr-doc website',
      io_update_title: 'Replaces the current data with the latest values from emr-doc.pmrs2.org',
      io_reset_btn: 'Reset to built-in data',
      io_reset_title: 'Remove imported or downloaded changes',

      // Results & Stats
      results_head: 'Results',
      clear_btn: 'Clear',
      clear_btn_title: 'Clear the results and the Values box to start again',
      stat_created: 'Created',
      stat_new: 'New',
      stat_exists: 'Already exist',
      stat_error: 'Failed',

      // Labels & notices
      lbl_created: 'Created',
      lbl_new: 'New',
      lbl_exists: 'Already exists',
      lbl_error: 'Failed',
      summarize_err_title: '{count} {values} could not be created.',
      summarize_err_detail: 'The reason is shown under each failed value below. Fix it on the page or try again.',
      summarize_check_new: '{count} {values} will be created.',
      summarize_check_detail: ' {exists} already {existsVerb} and will be skipped. Click "Create values" to add them.',
      summarize_check_none_title: 'Nothing to create.',
      summarize_check_none_detail: ' All values already exist in this list.',
      summarize_done_title: 'Done. {count} {values} created.',
      summarize_done_none_title: 'Done. Nothing new to create.',
      summarize_done_detail: ' {exists} already existed and {wasWere} skipped.',

      // EMR Summary & Messages
      emr_choose_placeholder: 'Choose a group to fill the values below',
      emr_search_placeholder: 'Search groups…',
      emr_no_match: 'No match',
      emr_summary_tmpl: '{groups} groups, {values} values. {from}.',
      emr_from_import: 'Imported from {file} on {date}',
      emr_from_sheet: 'Synced from Google Sheet, last change {date}',
      emr_from_web: 'Downloaded from emr-doc.pmrs2.org on {date}',
      emr_from_builtin: 'Built-in values from {date}',
      emr_downloading: 'Downloading the latest values from emr-doc.pmrs2.org…',
      emr_download_err: 'Could not update EMR data ({error}). Check your internet connection and try again. The saved values are still used.',
      emr_imported_ok: 'Imported {groups} groups ({values} values).',
      emr_reset_ok: 'Reset to built-in data.',
      emr_updated_ok: 'Updated: {groups} groups ({values} values) downloaded from emr-doc.pmrs2.org.',

      // Footer
      footer_keep_open: 'Keep this tab open while values are being created.',

      // Dialog & general
      dlg_cancel: 'Cancel',
      dlg_ok: 'OK',
      dlg_create: 'Create',
      dlg_create_all: 'Create all',
      plural_value: 'value',
      plural_values: 'values',
      plural_list: 'list',
      plural_lists: 'lists',
      about_seconds: 'about {sec} s',
      about_minutes: 'about {min} min'
    },
    km: {
      // Header
      app_title: 'Auli',
      app_desc: 'បញ្ចូលទិន្នន័យទៅក្នុង Value Lists នៃមន្ទីរពេទ្យជាក្រុម។ តម្លៃដែលមានស្រាប់នឹងត្រូវរំលង។',
      lang_btn_title_en: 'ប្តូរជាភាសាខ្មែរ (Switch to Khmer)',
      lang_btn_title_km: 'Switch to English (ប្តូរជាភាសាអង់គ្លេស)',
      settings_btn_title: 'ការកំណត់៖ ល្បឿន, ទិន្នន័យ EMR',
      settings_btn_aria: 'ការកំណត់',
      settings_btn_close: 'បិទការកំណត់',
      theme_btn_dark: 'ប្តូរទៅទម្រង់ងងឹត',
      theme_btn_light: 'ប្តូរទៅទម្រង់ពន្លឺ',

      // Current page
      page_status_label: 'ទំព័របច្ចុប្បន្ន',
      page_checking: 'កំពុងពិនិត្យ…',
      page_not_valuelist: 'មិនមែនជាទំព័រ Value List ទេ',
      page_valuelist: 'Value List · {type}',
      page_hint_bad: 'ចូលទៅកាន់ Hospital › Value List ក្នុងប្រព័ន្ធមន្ទីរពេទ្យ ហើយបើកបញ្ជីណាមួយ។',
      page_not_ready: 'ទំព័រមិនទាន់រួចរាល់ទេ។',
      page_reload_retry: '{error} សូមផ្ទុកទំព័រឡើងវិញ រួចព្យាយាមម្តងទៀត។',
      page_could_not_work: 'មិនអាចដំណើរការជាមួយទំព័រនេះបានទេ។',

      // Shared setting
      emr_desc_label: 'ឈ្មោះ / ការពិពណ៌នា សម្រាប់តម្លៃ EMR',
      opt_desc_none: 'ឈ្មោះជាភាសាអង់គ្លេសតែប៉ុណ្ណោះ',
      opt_desc_khmer: 'ឈ្មោះជាភាសាខ្មែរតែប៉ុណ្ណោះ',
      opt_desc_en: 'ឈ្មោះជាភាសាអង់គ្លេស | ការពិពណ៌នាជាភាសាអង់គ្លេស',
      opt_desc_khmer_en: 'ឈ្មោះជាភាសាអង់គ្លេស | ការពិពណ៌នា ខ្មែរ - អង់គ្លេស',
      opt_desc_code: 'ឈ្មោះជាភាសាអង់គ្លេស | កូដ',

      // Tabs
      tab_sync: 'ធ្វើសមកាលកម្មទាំងអស់',
      tab_single: 'ម្តងមួយៗ',

      // Mode 1: Sync all
      sync_intro: 'បំពេញគ្រប់បញ្ជីនៅលើទំព័រនេះពីស្តង់ដារ EMR។ បញ្ជីដែលមានឈ្មោះដូចក្រុម EMR ត្រូវបានរកឃើញដោយស្វ័យប្រវត្តិ។ ដោះធីកអ្វីដែលអ្នកមិនចង់បាន រួចចុចបង្កើត។',
      matched_lists: 'បញ្ជីដែលត្រូវគ្នា',
      uncheck_all: 'ដោះធីកទាំងអស់',
      check_all: 'ធីកទាំងអស់',
      sync_empty_info: 'បើកទំព័រ Value List ដើម្បីស្វែងរកបញ្ជីដែលត្រូវគ្នានឹងក្រុម EMR។',
      sync_btn_create: 'បង្កើតទាំងអស់ដែលត្រូវគ្នា',
      sync_looking: 'កំពុងស្វែងរកបញ្ជីដែលត្រូវគ្នា…',
      sync_open_page_hint: 'បើកទំព័រ Value List ក្នុងផ្ទាំងនេះ។ បញ្ជីដែលត្រូវគ្នានឹងក្រុម EMR នឹងបង្ហាញនៅទីនេះ។',
      sync_matched_count: '{matches} ក្នុងចំណោម {total} បញ្ជីនៅលើទំព័រនេះត្រូវគ្នានឹងក្រុម EMR។',
      sync_none_matched: 'គ្មានបញ្ជីណាមួយក្នុងចំណោម {total} បញ្ជីនៅលើទំព័រនេះត្រូវគ្នានឹងក្រុម EMR ទេ។ សាកល្បងផ្ទាំងផ្សេងទៀត (Medical Record, Examination…) ឬប្រើ "ម្តងមួយៗ"។',
      sync_row_values: '{n} / {total} តម្លៃ · {group}',
      sync_hide_values: 'លាក់តម្លៃ',
      sync_choose_values: 'ជ្រើសរើសតម្លៃដែលត្រូវបង្កើត',
      sync_create_in_lists_ask: 'បង្កើតតម្លៃក្នុង {count} បញ្ជី?',
      sync_up_to_values: 'រហូតដល់ {count} តម្លៃ៖',
      sync_creating_list_n: 'កំពុងបង្កើតបញ្ជី {current} នៃ {total}៖ {label}…',
      sync_page_timeout: 'ទំព័របញ្ជីមិនបានផ្ទុកទាន់ពេលវេលាទេ។ ដំណើរការម្តងទៀតដើម្បីសាកល្បងឡើងវិញ; តម្លៃដែលមានស្រាប់នឹងត្រូវរំលង។',
      sync_stopped: 'បានបញ្ឈប់មុនពេលបញ្ចប់។',
      sync_stopped_detail: '{error} តម្លៃដែលបានបង្កើតរួចត្រូវបានរក្សាទុក។ ដំណើរការម្តងទៀតដើម្បីបញ្ចប់; តម្លៃដែលមានស្រាប់នឹងត្រូវរំលង។',

      // Mode 2: One by one
      single_intro: 'បន្ថែមតម្លៃទៅកាន់បញ្ជីដែលកំពុងបើកក្នុងផ្ទាំងនេះ។',
      emr_group_label: '1. ក្រុម EMR',
      optional: '(ស្រេចចិត្ត)',
      emr_update_link: 'ធ្វើបច្ចុប្បន្នភាពទិន្នន័យ EMR',
      emr_update_title: 'ទាញយកតម្លៃចុងក្រោយពី emr-doc.pmrs2.org',
      values_label: '2. តម្លៃ',
      values_count: '{n} តម្លៃ',
      values_placeholder: 'មួយតម្លៃក្នុងមួយបន្ទាត់ ឧទាហរណ៍៖\nFever\nHeadache | Pain in the head',
      values_help: 'ដាក់តម្លៃនីមួយៗនៅលើបន្ទាត់ដាច់ដោយឡែក។ ដើម្បីបន្ថែមការពិពណ៌នា សូមប្រើ <code>Name | Description</code>។',
      btn_check: 'ពិនិត្យ',
      btn_check_title: 'មើលថាតើតម្លៃណាខ្លះជាតម្លៃថ្មី ដោយមិនទាន់បង្កើត',
      btn_create: 'បង្កើតតម្លៃ',
      val_err_empty: 'សូមបញ្ចូលយ៉ាងហោចណាស់តម្លៃមួយ មួយតម្លៃក្នុងមួយបន្ទាត់ ឬជ្រើសរើសក្រុម EMR ខាងលើ។',
      not_val_page_title: 'ផ្ទាំងនេះមិនមែនជាទំព័រ Value List ទេ។',
      not_val_page_detail: 'នៅក្នុងប្រព័ន្ធមន្ទីរពេទ្យ សូមចូលទៅ Hospital › Value List បើកបញ្ជីណាមួយ រួចព្យាយាមម្តងទៀត។',
      create_values_ask: 'បង្កើត {count} តម្លៃ?',
      note_skip_exist: 'តម្លៃដែលមានរួចហើយនឹងត្រូវរំលង។',
      note_wait_delay: 'រង់ចាំ {delay} រវាងតម្លៃនីមួយៗ (សរុប {estimate})។',
      creating_values_busy: 'កំពុងបង្កើត {count} តម្លៃ…',
      checking_values_busy: 'កំពុងពិនិត្យតម្លៃដែលមានស្រាប់…',
      waiting_delay_busy: 'រង់ចាំ {delay} រវាងតម្លៃនីមួយៗ។ សូមកុំបិទផ្ទាំងនេះរហូតដល់រួចរាល់។',

      // Settings
      back_btn: 'ត្រឡប់ក្រោយ',
      back_btn_title: 'ត្រឡប់ទៅ ធ្វើសមកាលកម្មទាំងអស់ / ម្តងមួយៗ',
      settings_title: 'ការកំណត់',
      settings_general: 'ទូទៅ',
      setting_lang_label: 'ភាសា / Language',
      settings_creating: 'ការបង្កើត',
      wait_between_values: 'រយៈពេលរង់ចាំរវាងតម្លៃនីមួយៗ',
      seconds_unit: 'វិនាទី',
      delay_help: 'ផ្អាកបន្តិចបន្ទាប់ពីតម្លៃនីមួយៗត្រូវបានបង្កើត និងរវាងបញ្ជីក្នុង "ធ្វើសមកាលកម្មទាំងអស់"។ អប្បបរមា និងលំនាំដើម៖ 2 វិនាទី ដែលជួយ Auli មិនឱ្យលើសពីដែនកំណត់ល្បឿនរបស់ប្រព័ន្ធមន្ទីរពេទ្យ។ បង្កើនវាប្រសិនបើអ្នកឃើញ "Too many requests" ឬតម្លៃមិនអាចរក្សាទុកបាន។ អតិបរមា 60។',
      delay_err_min: 'អប្បបរមាគឺ {min} វិនាទី។ តិចជាងនេះអាចលើសពីដែនកំណត់ល្បឿនរបស់ប្រព័ន្ធមន្ទីរពេទ្យ។',
      delay_err_range: 'សូមបញ្ចូលចំនួនវិនាទីចាប់ពី {min} ដល់ {max}។',
      settings_emr_data: 'ទិន្នន័យ EMR',
      emr_data_intro: 'តម្លៃ EMR ដែលប្រើដោយ "ធ្វើសមកាលកម្មទាំងអស់" និង "ម្តងមួយៗ"។ នាំចេញពួកវា កែសម្រួល ឬបន្ថែមតម្លៃក្នុង Excel រួចនាំចូលឯកសារមកវិញ។',
      current_data_label: 'ទិន្នន័យបច្ចុប្បន្ន',
      io_export_head: '1. នាំចេញ',
      io_export_help: 'ទាញយកតម្លៃបច្ចុប្បន្នដើម្បីកែសម្រួល។',
      io_export_csv: 'នាំចេញ CSV',
      io_export_csv_title: 'បើកក្នុង Excel ឬ Google Sheets',
      io_export_json: 'JSON',
      io_export_json_title: 'សម្រាប់អ្នកអភិវឌ្ឍន៍ / ការបម្រុងទុក',
      io_import_head: '2. នាំចូល',
      io_import_help: 'ជ្រើសរើសឯកសារ .csv ឬ .json ដែលបានកែប្រែ។ វានឹងជំនួសតម្លៃបច្ចុប្បន្ន។',
      io_import_btn: 'នាំចូលឯកសារ…',
      sheet_label: 'Team Google Sheet <small>កែសម្រួលរួមគ្នា សមកាលកម្មផ្ទាល់</small>',
      sheet_placeholder: 'https://docs.google.com/spreadsheets/d/…',
      sheet_sync_btn: 'សមកាលកម្មឥឡូវនេះ',
      sheet_auto_label: 'រក្សាការសមកាលកម្ម (ពិនិត្យរៀងរាល់ 30 វិនាទីពេល Auli កំពុងបើក)',
      sheet_status_help: 'ជួរឈរដូចគ្នានឹងការនាំចេញ CSV។ ចែករំលែកសន្លឹកកិច្ចការជា <b>Anyone with the link: Viewer</b> រួចបិទភ្ជាប់តំណភ្ជាប់នៅទីនេះ។',
      sheet_paste_link_err: 'សូមបិទភ្ជាប់តំណ Google Sheets (https://docs.google.com/spreadsheets/…)។',
      sheet_reading: 'កំពុងអាន Google Sheet…',
      sheet_net_err: 'មិនអាចភ្ជាប់ទៅកាន់ Google Sheets បានទេ។ សូមពិនិត្យការភ្ជាប់អ៊ីនធឺណិតរបស់អ្នក។',
      sheet_share_err: 'Google មិនបានចែករំលែកសន្លឹកកិច្ចការនេះទេ។ ក្នុងសន្លឹកកិច្ចការ ចុច Share › General access › "Anyone with the link" (Viewer) រួចធ្វើសមកាលកម្មម្តងទៀត។',
      sheet_empty_err: 'សន្លឹកកិច្ចការគ្មានតម្លៃទេ។ សូមបន្ថែមជួរដេកជាមួយក្រុម និងឈ្មោះភាសាអង់គ្លេស។',
      sheet_problems_err: 'សន្លឹកកិច្ចការមានបញ្ហា ដូច្នេះទិន្នន័យបច្ចុប្បន្នត្រូវបានរក្សាទុក៖ {errors}',
      sheet_synced_ok: 'បានសមកាលកម្មនៅម៉ោង {time}: {groups} ក្រុម, {values} តម្លៃ។',

      // Guide
      guide_summary: 'របៀបកែសម្រួលទិន្នន័យ EMR',
      guide_step1: 'ចុច <b>នាំចេញ CSV</b> ហើយបើកឯកសារក្នុង Excel ឬ Google Sheets។',
      guide_step2: 'កែសម្រួលវា។ <b>មួយជួរដេក = មួយតម្លៃ។</b> ជួរដេកដែលមាន <code>group</code>, <code>page</code> និង <code>section</code> ដូចគ្នា បង្កើតបានជាបញ្ជីតែមួយ។',
      guide_step2_change: '<b>ផ្លាស់ប្តូរ</b> តម្លៃ៖ កែសម្រួលក្រឡា។',
      guide_step2_add_val: '<b>បន្ថែមតម្លៃ</b>៖ បន្ថែមជួរដេក ហើយចម្លង group, page និង section ពីជួរដេកមួយនៃបញ្ជីនោះ។',
      guide_step2_add_grp: '<b>បន្ថែមក្រុម</b>៖ បន្ថែមជួរដេកជាមួយឈ្មោះក្រុមថ្មី។',
      guide_step2_del_val: '<b>លុប</b> តម្លៃ៖ លុបជួរដេករបស់វា។ ឈ្មោះស្ទួនក្នុងបញ្ជីតែមួយ (មិនគិតអក្សរធំ/តូច) នឹងត្រូវរំលង។',
      guide_step3: 'រក្សាទុកជា <b>CSV UTF-8</b> (Excel: File › Save As › "CSV UTF-8") ដើម្បីរក្សាអក្សរខ្មែរ។ ឯកសារដែលប្រើ <code>;</code> ជំនួស <code>,</code> ក៏អាចប្រើបានដែរ។',
      guide_step4: 'ចុច <b>នាំចូលឯកសារ…</b> ជ្រើសរើសវា ហើយបញ្ជាក់។ វា <b>ជំនួសទិន្នន័យ EMR បច្ចុប្បន្នទាំងអស់</b> ដូច្នេះសូមនាំចេញជាមុនសិន ប្រសិនបើអ្នកចង់រក្សាទុកច្បាប់ចម្លង។ ប្រសិនបើមានបញ្ហា អ្នកនឹងឃើញលេខជួរដេក ហើយគ្មានអ្វីផ្លាស់ប្តូរទេ។',
      cols_caption: 'ជួរឈរ',
      col_group_desc: '<b>ចាំបាច់។</b> ឈ្មោះក្រុម។ ប្រើឈ្មោះដូចគ្នានឹងបញ្ជីក្នុងប្រព័ន្ធមន្ទីរពេទ្យ (ឧ. <i>Birth Control Type</i>) ដើម្បីឱ្យ "ធ្វើសមកាលកម្មទាំងអស់" អាចផ្គូផ្គងបាន។',
      col_code_desc: 'កូដ (ស្រេចចិត្ត; ឧ. <i>OBVA-S000099</i>)។ ប្រសិនបើទទេ ឈ្មោះអង់គ្លេសនឹងត្រូវប្រើ។',
      col_english_desc: '<b>ចាំបាច់។</b> ឈ្មោះជាភាសាអង់គ្លេសនៃតម្លៃ (ឧ. <i>Combined Oral Contraceptive (COC)</i>)។',
      col_khmer_desc: 'ឈ្មោះជាភាសាខ្មែរ (ស្រេចចិត្ត; ឧ. <i>ថ្នាំគ្រាប់ស៊ីអូស៊ី</i>)។ ត្រូវបានបង្កើតជំនួសឈ្មោះអង់គ្លេសនៅពេលជ្រើសរើស "ឈ្មោះជាភាសាខ្មែរតែប៉ុណ្ណោះ"។',
      col_desc_desc: 'ការពិពណ៌នាជាភាសាអង់គ្លេសវែងជាងនេះ (ស្រេចចិត្ត)។',
      col_page_desc: 'សម្រាប់ដាក់បញ្ជីជាក្រុមក្នុងការជ្រើសរើសក្រុម (ស្រេចចិត្ត; "Custom" ប្រសិនបើទទេ)។ ឈ្មោះក្រុមដូចគ្នា ប៉ុន្តែនៅ page ឬ section ផ្សេង នឹងក្លាយជាបញ្ជីដាច់ដោយឡែក។',
      guide_team_sheet: '<b>Team Google Sheet:</b> ក្នុង Google Sheets, File › Import › ផ្ទុកឡើង CSV ដែលបាននាំចេញ។ ចុច Share › General access › <b>Anyone with the link</b> (Viewer) ឬប្រើ File › Share › Publish to web។ បិទភ្ជាប់តំណសន្លឹកកិច្ចការខាងលើ ហើយបើក <b>រក្សាការសមកាលកម្ម</b>។ ក្រុមការងាររបស់អ្នកកែសម្រួលសន្លឹកកិច្ចការ; ពេល Auli កំពុងបើក វានឹងទាញយកការផ្លាស់ប្តូរក្នុងរយៈពេល 30 វិនាទី។ ប្រើផ្ទាំងដែលតំណភ្ជាប់ចង្អុលទៅ (ផ្នែក <code>#gid=</code>)។ ប្រសិនបើជួរដេកណាមួយមានបញ្ហា ទិន្នន័យបច្ចុប្បន្នត្រូវបានរក្សាទុករហូតដល់វាត្រូវបានកែប្រែរួចរាល់។ ការនាំចូលឯកសារ ឬការកំណត់ឡើងវិញ នឹងបិទ <b>រក្សាការសមកាលកម្ម</b>។',
      guide_example: 'ឧទាហរណ៍៖',
      guide_setting_note: 'ថាតើឈ្មោះជាភាសាអង់គ្លេស ឬខ្មែរត្រូវបានបង្កើត និងការពិពណ៌នាណាមួយ គឺកំណត់ដោយ "ឈ្មោះ / ការពិពណ៌នា សម្រាប់តម្លៃ EMR" នៅលើអេក្រង់មេ។ ដើម្បីត្រឡប់ការផ្លាស់ប្តូរទាំងអស់ សូមប្រើ <b>កំណត់ទិន្នន័យដើមឡើងវិញ</b>។',
      io_update_btn: 'ធ្វើបច្ចុប្បន្នភាពពីគេហទំព័រ emr-doc',
      io_update_title: 'ជំនួសទិន្នន័យបច្ចុប្បន្នដោយតម្លៃចុងក្រោយពី emr-doc.pmrs2.org',
      io_reset_btn: 'កំណត់ទិន្នន័យដើមឡើងវិញ',
      io_reset_title: 'លុបការផ្លាស់ប្តូរដែលបាននាំចូល ឬទាញយក',

      // Results & Stats
      results_head: 'លទ្ធផល',
      clear_btn: 'សម្អាត',
      clear_btn_title: 'សម្អាតលទ្ធផល និងប្រអប់តម្លៃដើម្បីចាប់ផ្តើមឡើងវិញ',
      stat_created: 'បានបង្កើត',
      stat_new: 'ថ្មី',
      stat_exists: 'មានរួចហើយ',
      stat_error: 'បរាជ័យ',

      // Labels & notices
      lbl_created: 'បានបង្កើត',
      lbl_new: 'ថ្មី',
      lbl_exists: 'មានរួចហើយ',
      lbl_error: 'បរាជ័យ',
      summarize_err_title: 'មិនអាចបង្កើត {count} តម្លៃបានទេ។',
      summarize_err_detail: 'មូលហេតុត្រូវបានបង្ហាញនៅក្រោមតម្លៃដែលបរាជ័យខាងក្រោម។ កែតម្រូវវានៅលើទំព័រ ឬព្យាយាមម្តងទៀត។',
      summarize_check_new: '{count} តម្លៃនឹងត្រូវបានបង្កើត។',
      summarize_check_detail: ' {exists} មានរួចហើយ ហើយនឹងត្រូវរំលង។ ចុច "បង្កើតតម្លៃ" ដើម្បីបន្ថែមពួកវា។',
      summarize_check_none_title: 'គ្មានអ្វីត្រូវបង្កើតទេ។',
      summarize_check_none_detail: ' តម្លៃទាំងអស់មានរួចហើយនៅក្នុងបញ្ជីនេះ។',
      summarize_done_title: 'រួចរាល់។ បានបង្កើត {count} តម្លៃ។',
      summarize_done_none_title: 'រួចរាល់។ គ្មានអ្វីថ្មីត្រូវបង្កើតទេ។',
      summarize_done_detail: ' {exists} មានរួចហើយ ហើយត្រូវបានរំលង។',

      // EMR Summary & Messages
      emr_choose_placeholder: 'ជ្រើសរើសក្រុមដើម្បីបំពេញតម្លៃខាងក្រោម',
      emr_search_placeholder: 'ស្វែងរកក្រុម…',
      emr_no_match: 'រកមិនឃើញ',
      emr_summary_tmpl: '{groups} ក្រុម, {values} តម្លៃ។ {from}។',
      emr_from_import: 'បាននាំចូលពី {file} នៅ {date}',
      emr_from_sheet: 'បានសមកាលកម្មពី Google Sheet ការផ្លាស់ប្តូរចុងក្រោយ {date}',
      emr_from_web: 'បានទាញយកពី emr-doc.pmrs2.org នៅ {date}',
      emr_from_builtin: 'តម្លៃភ្ជាប់មកជាមួយពី {date}',
      emr_downloading: 'កំពុងទាញយកតម្លៃចុងក្រោយពី emr-doc.pmrs2.org…',
      emr_download_err: 'មិនអាចធ្វើបច្ចុប្បន្នភាពទិន្នន័យ EMR ({error}) បានទេ។ សូមពិនិត្យមើលការភ្ជាប់អ៊ីនធឺណិតរបស់អ្នក ហើយព្យាយាមម្តងទៀត។ តម្លៃដែលបានរក្សាទុកនៅតែត្រូវបានប្រើប្រាស់។',
      emr_imported_ok: 'បាននាំចូល {groups} ក្រុម ({values} តម្លៃ)។',
      emr_reset_ok: 'បានកំណត់ទិន្នន័យដើមឡើងវិញ។',
      emr_updated_ok: 'បានធ្វើបច្ចុប្បន្នភាព៖ {groups} ក្រុម ({values} តម្លៃ) បានទាញយកពី emr-doc.pmrs2.org។',

      // Footer
      footer_keep_open: 'សូមកុំបិទផ្ទាំងនេះនៅពេលកំពុងបង្កើតតម្លៃ។',

      // Dialog & general
      dlg_cancel: 'បោះបង់',
      dlg_ok: 'យល់ព្រម',
      dlg_create: 'បង្កើត',
      dlg_create_all: 'បង្កើតទាំងអស់',
      plural_value: 'តម្លៃ',
      plural_values: 'តម្លៃ',
      plural_list: 'បញ្ជី',
      plural_lists: 'បញ្ជី',
      about_seconds: 'ប្រហែល {sec} វិនាទី',
      about_minutes: 'ប្រហែល {min} នាទី'
    }
  };

  let currentLang = 'en';

  const readSaved = () => {
    try {
      const v = localStorage.getItem(KEY);
      return v === 'km' || v === 'en' ? v : 'en';
    } catch {
      return 'en';
    }
  };

  function t(key, params = {}) {
    const lang = currentLang;
    let str = (DICT[lang] && DICT[lang][key]) || (DICT.en && DICT.en[key]) || key;
    for (const [k, v] of Object.entries(params)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
    }
    return str;
  }

  function tPlural(n, wordKey) {
    if (currentLang === 'km') return `${n} ${t(wordKey)}`;
    return `${n} ${n === 1 ? t(wordKey) : t(wordKey + 's')}`;
  }

  function tPluralWord(n, wordKey) {
    if (currentLang === 'km') return t(wordKey);
    return n === 1 ? t(wordKey) : t(wordKey + 's');
  }

  function tSeconds(d) {
    if (currentLang === 'km') return `${d} វិនាទី`;
    return `${d} ${d === 1 ? 'second' : 'seconds'}`;
  }

  function tEstimate(n, delay) {
    const sec = Math.ceil(n * (1.5 + delay));
    if (sec < 60) return t('about_seconds', { sec });
    return t('about_minutes', { min: Math.ceil(sec / 60) });
  }

  function apply(root = document) {
    // textContent
    root.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      if (key) el.textContent = t(key);
    });

    // innerHTML
    root.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.dataset.i18nHtml;
      if (key) el.innerHTML = t(key);
    });

    // title
    root.querySelectorAll('[data-i18n-title]').forEach((el) => {
      const key = el.dataset.i18nTitle;
      if (key) el.title = t(key);
    });

    // placeholder
    root.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.dataset.i18nPlaceholder;
      if (key) el.placeholder = t(key);
    });

    // aria-label
    root.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
      const key = el.dataset.i18nAriaLabel;
      if (key) el.setAttribute('aria-label', t(key));
    });

    // Update lang button attributes and badge
    const langBtn = document.getElementById('lang');
    if (langBtn) {
      const title = currentLang === 'en' ? t('lang_btn_title_en') : t('lang_btn_title_km');
      langBtn.title = title;
      langBtn.setAttribute('aria-label', title);
      const tag = langBtn.querySelector('.lang-tag');
      if (tag) tag.textContent = currentLang === 'km' ? 'KH' : 'EN';
    }

    // Update settings select if present
    const settingLang = document.getElementById('setting-lang');
    if (settingLang && settingLang.value !== currentLang) {
      settingLang.value = currentLang;
    }
  }

  function setLang(lang) {
    if (lang !== 'en' && lang !== 'km') lang = 'en';
    currentLang = lang;
    try { localStorage.setItem(KEY, lang); } catch {}
    try { chrome.storage?.local?.set({ [KEY]: lang }); } catch {}
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-lang', lang);
    apply();
    document.dispatchEvent(new CustomEvent('lang-changed', { detail: { lang } }));
  }

  // Pre-apply right away on script run
  currentLang = readSaved();
  document.documentElement.lang = currentLang;
  document.documentElement.setAttribute('data-lang', currentLang);

  // Sync from chrome.storage if different
  try {
    chrome.storage?.local?.get(KEY, (v) => {
      if (v && v[KEY] && v[KEY] !== currentLang) setLang(v[KEY]);
    });
  } catch {}

  document.addEventListener('DOMContentLoaded', () => {
    apply();
    document.getElementById('lang')?.addEventListener('click', () => {
      setLang(currentLang === 'en' ? 'km' : 'en');
    });
    document.getElementById('setting-lang')?.addEventListener('change', (e) => {
      setLang(e.target.value);
    });
  });

  window.I18N = {
    getLang: () => currentLang,
    setLang,
    apply,
    t,
    tPlural,
    tPluralWord,
    tSeconds,
    tEstimate,
  };
  window.t = t;
  window.tPlural = tPlural;
  window.tPluralWord = tPluralWord;
  window.tSeconds = tSeconds;
  window.tEstimate = tEstimate;
})();

