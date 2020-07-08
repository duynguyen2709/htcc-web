let slider = document.getElementById("InputAmountUser");
        let output = document.getElementById("AmountUser");
        let outputSecond = document.getElementById("AmountUserSecond");
        output.innerHTML = slider.value;
        outputSecond.innerHTML = slider.value;


        let Features = [{
                name: "Ứng dụng HTCC",
                price: 0,
                status: true,
                isDefault: true,
            },
            {
                name: "Lịch",
                price: 0,
                status: true,
                isDefault: true,
            },
            {
                name: "Nhân viên",
                price: 5000,
                status: true,
                isDefault: true,
            },
            {
                name: "Chấm công",
                price: 10000,
                status: true,
                isDefault: false,
            },
            {
                name: "Yêu cầu",
                price: 5000,
                status: true,
                isDefault: false,
            },
            {
                name: "Tiền Lương",
                price: 10000,
                status: true,
                isDefault: false,
            },
            {
                name: "KPI",
                price: 5000,
                status: true,
                isDefault: false,
            },
            {
                name: "Tuyển dụng",
                price: 1000000,
                status: true,
                isDefault: false,
            },
            {
                name: "Truyền thông",
                price: 2000,
                status: true,
                isDefault: false,
            },
            {
                name: "Báo cáo",
                price: 2000,
                status: false,
                isDefault: false,
            },
            {
                name: "Tài sản",
                price: 2000,
                status: false,
                isDefault: false,
            }
        ]

        let FeaturesList = document.getElementById("features-list");
        let FeaturesPrice = document.getElementById("features-price")


        Features.forEach(el => {
            let html =
                '<li>\
                            <div id="SingleFeature" class="featureWrapper" onclick="selectFeature(event, \'' + el.name + '\')"> \
                                <span class="feature-select">';
                                if(el.isDefault){
                                    html += '<i class="fa fa-check-circle fa-lg default-check" aria-hidden="true"></i>'
                                }
                                else if(el.status){
                                    html += '<i class="fa fa-check-circle check fa-lg" aria-hidden="true"></i>'
                                }
                                else{
                                    html += '<i class="far fa-circle fa-lg"></i>'
                                    //html += '<i class="fa fa-circle empty-circle"></i>'
                                    //html += '<img src="css/circle-regular.svg" class="circle-icon"></img>'
                                }


                                html +=    '<b>' + el.name + '</b> \
                                </span> \
                                <span>' + formatNumber(el.price)
                                if(el.name === 'Tuyển dụng')
                                    html += ' đ/tháng</span> '
                                else
                                    html += ' đ/người/tháng</span>'
                            html += '</div> \
                        </li>'

            FeaturesList.innerHTML += html
        })

        updatePrice()

        slider.oninput = function () {
            console.log("slider: " + this.value);
            outputSecond.innerHTML = slider.value;
            output.innerHTML = slider.value;
            console.log("second: " + outputSecond.innerHTML)
            console.log("slider: " + this.value);

            updatePrice()
        }


        TabActiveFirst = document.getElementById('price-bundle')
        TabActiveFirst.className = TabActiveFirst.className.replace(" tab-content-hidden", "");
        //console.log(TabActiveFirst.className)

        function formatNumber(num){
            return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
        }

        // updatePrice = function(){

        // }

        function updatePrice() {
            let PriceTotal = document.getElementById("TotalPrice")
            let fee = document.getElementById("fee")
            let PerMonth = document.getElementById("Per-month")
            let Sale = document.getElementById("sale")

            FeaturesPrice.innerHTML = '';
            let total = 0;
                Features.forEach(el => {
                    let price = 0;

                        if (el.status) {
                            let html_price = '<li>\
                            <div ><span>';

                            html_price += el.name + ' \
                                </span><span>'
                                
                            if (el.name === 'Tuyển dụng'){
                                price = el.price * 12
                            }
                            else{
                                price = el.price * slider.value * 12
                                
                            }
                            total += price;
                            html_price += formatNumber(price)
                            html_price += ' đ</span></div></li>'

                            FeaturesPrice.innerHTML += html_price

                            //PriceTotal.innerHTML = parseInt(PriceTotal.innerHTML) + price
                        }

                        
                    })

                    PriceTotal.innerHTML = formatNumber(total);
                    let SalePrice = Math.round(total*0.3)
                    Sale.innerHTML = formatNumber(SalePrice);
                    fee.innerHTML = formatNumber(total - SalePrice);
                    PerMonth.innerHTML = formatNumber(Math.round((total - SalePrice)/12));
                }
                
        function selectFeature(e, feature){
            if(!Features.find(el => el.name === feature).isDefault){
            if(e.currentTarget.innerHTML.indexOf("fa-check-circle") !== -1){
                //console.log(e.currentTarget.innerHTML)
                e.currentTarget.innerHTML = e.currentTarget.innerHTML.replace("fa fa-check-circle check", "far fa-circle")
                //console.log(feature)
                Features.find(el => el.name === feature).status = false;
            }
            else{
                //console.log("not check")
                //console.log(e.currentTarget.innerHTML)
                e.currentTarget.innerHTML = e.currentTarget.innerHTML.replace("far fa-circle", "fa fa-check-circle check")
                Features.find(el => el.name === feature).status = true;
            }

            updatePrice();
        }
    }

        function onClickBtnPrice(e, type) {
            console.log("click")
            var current = document.getElementsByClassName("active-price-bundle");
            current[0].className = current[0].className.replace(" active-price-bundle", "");
            e.currentTarget.className += " active-price-bundle";

            //let tabcontent = document.getElementsByClassName("tab-content-hidden");
            // for (i = 0; i < tabcontent.length; i++) {
            //     tabcontent[i].className += " tab-content-hidden";
            // }

            let TabActive = document.getElementById(type);
            TabActive.className = TabActive.className.replace(" tab-content-hidden", "");

            if (type === 'price-bundle') {
                let TabHidden = document.getElementById('price-custom');
                TabHidden.className += " tab-content-hidden";
            } else {
                let TabHidden = document.getElementById('price-bundle');
                TabHidden.className += " tab-content-hidden";
            }

            // var i, tabcontent, tablinks;
            // tabcontent = document.getElementsByClassName("tabcontent");
            // for (i = 0; i < tabcontent.length; i++) {
            //     tabcontent[i].style.display = "none";
            // }
            // tablinks = document.getElementsByClassName("tablinks");
            // for (i = 0; i < tablinks.length; i++) {
            //     tablinks[i].className = tablinks[i].className.replace(" active", "");
            // }
            // document.getElementById(cityName).style.display = "block";
            // evt.currentTarget.className += " active";
        }
    
        function clickBundle(event) {
            let bundles = document.getElementsByClassName("single-price-plan");

            console.log("bundle lenght: " + bundles.length)

            let i;
            for(i = 0; i < bundles.length; i++){
                bundles[i].className = bundles[i].className.replace(" active", "");
                console.log(bundles[i].className)
            }

            event.currentTarget.className += " active"
        }