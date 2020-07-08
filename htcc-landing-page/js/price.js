let slider = document.getElementById("InputAmountUser");
let output = document.getElementById("AmountUser");
let outputSecond = document.getElementById("AmountUserSecond");
output.innerHTML = slider.value;
outputSecond.innerHTML = slider.value;

let count = 1;
let featureList, comboList;
let featureChoosenList = [];
let FeaturesListEl = document.getElementById("features-list");
let FeaturesPriceEl = document.getElementById("features-price")

function sortByPrice(list) {
  const sortedList = [...list];
  sortedList.sort((a, b) => a.unitPrice - b.unitPrice);

  return sortedList;
}

function setUpFeature(data) {
    featureList = data.featureList,
    comboList = data.comboList;

  featureList = [...sortByPrice(featureList)];



  featureList.forEach(el => 
    {
      if(!el.unitPrice) {
        featureChoosenList.push(el);
      }

    let html =
      '<li>\
        <div id="SingleFeature" class="featureWrapper" onclick="selectFeature(event, \'' + el.featureName + '\')"> \
          <span class="feature-select">';
    if (!el.unitPrice) {
      html += '<i class="fa fa-check-circle fa-lg default-check" aria-hidden="true"></i>'
    }else {
      html += '<i class="far fa-circle fa-lg"></i>'
    }


    html += '<b>' + el.featureName + '</b> \
                                </span> \
                                <span>' + formatNumber(el.unitPrice)
    if (el.featureName === 'Tuyển dụng')
      html += ' đ/tháng</span> '
    else
      html += ' đ/người/tháng</span>'
    html += '</div> \
                        </li>'

    FeaturesListEl.innerHTML += html
  })

  updatePrice()

  slider.oninput = function () {
    outputSecond.innerHTML = slider.value;
    output.innerHTML = slider.value;

    updatePrice()
  }


  TabActiveFirst = document.getElementById('price-bundle')
  TabActiveFirst.className = TabActiveFirst.className.replace(" tab-content-hidden", "");
}

const getFeatures = async () => {
  await axios.get('http://167.179.80.90:8761/api/gateway/public/features', ).then(function (response) {
      setUpFeature(response.data.data);
    })
    .catch(function (error) {
      alert("error: ", count);
    });
}



function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function updatePrice() {
  let PriceTotal = document.getElementById("TotalPrice")
  let PerMonth = document.getElementById("Per-month")

  FeaturesPriceEl.innerHTML = '';
  let total = 0;
  featureChoosenList.forEach(el => {
    let price = 0;

      let html_price = '<li>\
                            <div ><span>';

      html_price += el.featureName + ' \
                                </span><span>'

      if (el.featureName === 'Tuyển dụng') {
        price = el.unitPrice * 12
      } else {
        price = el.unitPrice * slider.value * 12

      }
      total += price;
      html_price += formatNumber(price)
      html_price += ' đ</span></div></li>'

      FeaturesPriceEl.innerHTML += html_price
    
  })

  PriceTotal.innerHTML = formatNumber(total);
  PerMonth.innerHTML = formatNumber(Math.round((total) / 12));
}

function selectFeature(e, feature) {
  
    if (e.currentTarget.innerHTML.indexOf("fa-check-circle") !== -1) {
      e.currentTarget.innerHTML = e.currentTarget.innerHTML.replace("fa fa-check-circle check", "far fa-circle")
      const indexRemoveFeature = featureChoosenList.find(el => el.featureName === feature);
      featureChoosenList.splice(indexRemoveFeature, 1);
    } else {
      e.currentTarget.innerHTML = e.currentTarget.innerHTML.replace("far fa-circle", "fa fa-check-circle check")
      featureChoosenList.push(featureList.find(el => el.featureName === feature))
    }

    updatePrice();
}

function onClickBtnPrice(e, type) {
  var current = document.getElementsByClassName("active-price-bundle");
  current[0].className = current[0].className.replace(" active-price-bundle", "");
  e.currentTarget.className += " active-price-bundle";

  let TabActive = document.getElementById(type);
  TabActive.className = TabActive.className.replace(" tab-content-hidden", "");

  if (type === 'price-bundle') {
    let TabHidden = document.getElementById('price-custom');
    TabHidden.className += " tab-content-hidden";
  } else {
    let TabHidden = document.getElementById('price-bundle');
    TabHidden.className += " tab-content-hidden";
  }
}

function clickBundle(event) {
  let bundles = document.getElementsByClassName("single-price-plan");

  let i;
  for (i = 0; i < bundles.length; i++) {
    bundles[i].className = bundles[i].className.replace(" active", "");
  }

  event.currentTarget.className += " active"
}

getFeatures();
