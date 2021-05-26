// 1. В ф-ю добавити два парам. - елемент, обєкт з опціями
// 2. В ф-ї замінити window на мій обєкт
// 3. Видалити document.write. Вставити в переданий елемент контент з document.write
//     - вар.1 innerHtml
//     - вар.2 Створ. елем. iFrame

function checkStorage() {
  document.getElementById('imo').value = localStorage.getItem('imo');
  document.getElementById('zoom').value = localStorage.getItem('zoom');
}

checkStorage();

// document.querySelector('.button').onclick = myClick;
document.querySelector('button').addEventListener('click', myClick);
document.querySelector('#zoom').addEventListener('click', myClick);

myClick();

// Single ship tracking
function myClick() {
  let options = {
    names: true, // always show ship names (defaults to false)
    zoom: document.getElementById('zoom').value, // initial zoom (between 3 and 18)
    width: '100%', // width in pixels or percentage
    // height: '180%', // height in pixels
    height: '860', // height in pixels
    // mmsi = "123456789", // display latest position (by MMSI)
    imo: document.getElementById('imo').value, // display latest position (by IMO, overrides MMSI)
    show_track: true, // display track line (last 24 hours)
  };
  const element = document.querySelector('#vessel-map');
  renderIframe(element, options);
  console.log('= ' + this);
  console.log('= ' + options.imo);
  console.log('= ' + options.zoom);
  localStorage.setItem('imo', options.imo);
  localStorage.setItem('zoom', options.zoom);
}

function renderIframe(element, options) {
  function parseBoolValue(value) {
    let new_value;
    if (value === undefined) new_value = false;
    if (value === 'true' || value == true) new_value = true;
    else if (value === 'false' || value == false) new_value = false;
    else new_value = false;
    return new_value;
  }

  let rh = location.href; //??????????????????????????????????????????????????

  if (rh.indexOf('file://') >= 0 || rh.indexOf('file%3A%2F%2F') >= 0) rh = 'testingonly';
  rh = encodeURIComponent(rh);
  let w = options.width;
  if (w === undefined) w = 800;
  let ws = w.toString();
  if (parseInt(w) < 480 && ws.charAt(ws.length - 1) !== '%') w = 480;
  if (ws.charAt(ws.length - 1) === '%') options.width = ws;
  else options.width = parseInt(w);

  let h = options.height;
  if (h === undefined) h = 600;
  let height = parseInt(h);
  if (height < 400) options.height = 400;
  else options.height = height;

  if (options.names === undefined) options.names = false;
  else options.names = parseBoolValue(options.names);

  options.show_track = parseBoolValue(options.show_track);

  options.click_to_activate = parseBoolValue(options.click_to_activate);
  let f = typeof options.fleet === 'undefined' ? false : options.fleet;
  if (f !== false && f.indexOf('@') >= 0) {
    f = false;
  }
  let fn =
    typeof options.fleet_name === 'undefined'
      ? false
      : encodeURIComponent(options.fleet_name);
  if (fn !== false && fn.indexOf('@') >= 0) {
    fn = false;
  }

  if (options.store_position === undefined) options.store_position = true;
  else options.store_position = parseBoolValue(options.store_position);
  if (options.mmsi !== undefined && parseInt(options.mmsi) != options.mmsi)
    options.mmsi = undefined;
  if (options.imo !== undefined && parseInt(options.imo) != options.imo)
    options.imo = undefined;
  if (options.latitude !== undefined && parseFloat(options.latitude) != options.latitude)
    options.latitude = undefined;
  if (
    options.longitude !== undefined &&
    parseFloat(options.longitude) != options.longitude
  )
    options.longitude = undefined;

  element.innerHTML =
    '<iframe name="vesselfinder" id="vesselfinder" ' +
    ' width="' +
    options.width +
    '"' +
    ' height="' +
    options.height +
    '"' +
    ' frameborder="0"' +
    ' src="https://www.vesselfinder.com/aismap?' +
    'zoom=' +
    (options.zoom === undefined ? 'undefined' : options.zoom) +
    (options.latitude === undefined
      ? '&amp;lat=undefined'
      : '&amp;lat=' + options.latitude) +
    (options.longitude === undefined
      ? '&amp;lon=undefined'
      : '&amp;lon=' + options.longitude) +
    '&amp;width=' +
    options.width +
    '&amp;height=' +
    options.height +
    '&amp;names=' +
    options.names +
    (options.mmsi === undefined ? '' : '&amp;mmsi=' + options.mmsi) +
    (options.imo === undefined ? '' : '&amp;imo=' + options.imo) +
    '&amp;track=' +
    options.show_track +
    (options.fleet === undefined ? '&amp;fleet=false' : '&amp;fleet=' + f) +
    (options.fleet_name === undefined
      ? '&amp;fleet_name=false'
      : '&amp;fleet_name=' + fn) +
    (options.fleet_timespan !== undefined
      ? '&amp;fleet_timespan=' + options.fleet_timespan
      : '') +
    (options.fleet_hide_old_positions === undefined
      ? '&amp;fleet_hide_old_positions=false'
      : '&amp;fleet_hide_old_positions=' + options.fleet_hide_old_positions) +
    '&amp;clicktoact=' +
    options.click_to_activate +
    '&amp;store_pos=' +
    options.store_position +
    (options.fil === undefined ? '' : '&amp;fil=' + options.fil) +
    (options.default_maptype === undefined
      ? ''
      : '&amp;default_maptype=' + options.default_maptype) +
    '&amp;ra=' +
    rh +
    '">Browser does not support embedded objects.<br/>Visit directly <a href="https://www.vesselfinder.com" target="_blank">www.vesselfinder.com</a>' +
    '</iframe>';

  console.log(element.innerHTML);
}
