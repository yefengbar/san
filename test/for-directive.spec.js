describe("ForDirective", function () {

    it("render list, data fill before attach", function () {
        var MyComponent = san.defineComponent({
            template: '<ul><li>name - email</li><li san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li><li>name - email</li></ul>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('persons', [
            {name: 'errorrik', email: 'errorrik@gmail.com'},
            {name: 'varsha', email: 'wangshuonpu@163.com'}
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');

        expect(lis.length).toBe(4);
        expect(lis[2].getAttribute('title')).toBe('varsha');
        expect(lis[2].innerHTML.indexOf('varsha - wangshuonpu@163.com')).toBe(0);
        expect(lis[1].getAttribute('title')).toBe('errorrik');
        expect(lis[1].innerHTML.indexOf('errorrik - errorrik@gmail.com')).toBe(0);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("render list use s-, data fill before attach", function () {
        var MyComponent = san.defineComponent({
            template: '<ul><li>name - email</li><li s-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li><li>name - email</li></ul>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('persons', [
            {name: 'errorrik', email: 'errorrik@gmail.com'},
            {name: 'varsha', email: 'wangshuonpu@163.com'}
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');

        expect(lis.length).toBe(4);
        expect(lis[2].getAttribute('title')).toBe('varsha');
        expect(lis[2].innerHTML.indexOf('varsha - wangshuonpu@163.com')).toBe(0);
        expect(lis[1].getAttribute('title')).toBe('errorrik');
        expect(lis[1].innerHTML.indexOf('errorrik - errorrik@gmail.com')).toBe(0);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("render list, no data", function () {
        var MyComponent = san.defineComponent({
            template: '<ul><li san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li></ul>'
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');

        expect(lis.length).toBe(0);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("render list, no data, push soon", function (done) {
        var MyComponent = san.defineComponent({
            initData: function () {
                return {
                    persons: []
                };
            },

            template: '<ul><li san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li></ul>'
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');

        expect(lis.length).toBe(0);

        var newLen = myComponent.data.push('persons',
            {name: 'otakustay', email: 'otakustay@gmail.com'}
        );
        expect(newLen).toBe(1);

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(1);
            expect(lis[0].getAttribute('title')).toBe('otakustay');
            expect(lis[0].innerHTML.indexOf('otakustay - otakustay@gmail.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("render list with template, template has sibling, no data, set soon", function (done) {
        var MyComponent = san.defineComponent({
            initData: function () {
                return {
                    persons: []
                };
            },

            template: '<div><h3>title</h3> <template san-for="p,i in persons">  <h4>{{p.name}}</h4><p>{{p.email}}</p></template> <h3>next</h3></div>'
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var h4s = wrap.getElementsByTagName('h4');
        var ps = wrap.getElementsByTagName('p');
        var h3s = wrap.getElementsByTagName('h3');

        expect(h4s.length).toBe(0);
        expect(ps.length).toBe(0);
        expect(h3s.length).toBe(2);

        myComponent.data.set('persons', [
            {name: 'otakustay', email: 'otakustay@gmail.com'},
            {name: 'errorrik', email: 'errorrik@gmail.com'}
        ]);

        san.nextTick(function () {
            var h4s = wrap.getElementsByTagName('h4');
            var ps = wrap.getElementsByTagName('p');
            expect(h4s.length).toBe(2);
            expect(ps.length).toBe(2);

            expect(h4s[0].innerHTML).toBe('otakustay');
            expect(ps[0].innerHTML).toBe('otakustay@gmail.com');
            expect(h4s[1].innerHTML).toBe('errorrik');
            expect(ps[1].innerHTML).toBe('errorrik@gmail.com');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("render list with template, template has sibling, pop and unshift soon", function (done) {
        var MyComponent = san.defineComponent({
            initData: function () {
                return {
                    persons: [
                        {name: 'otakustay', email: 'otakustay@gmail.com'},
                        {name: 'errorrik', email: 'errorrik@gmail.com'}
                    ]
                };
            },

            template: '<div><h3>title</h3> <template san-for="p,i in persons">  <h4>{{p.name}}</h4><p>{{p.email}}</p></template> <h3>next</h3></div>'
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var h4s = wrap.getElementsByTagName('h4');
        var ps = wrap.getElementsByTagName('p');
        var h3s = wrap.getElementsByTagName('h3');

        expect(h4s.length).toBe(2);
        expect(ps.length).toBe(2);

        expect(h4s[0].innerHTML).toBe('otakustay');
        expect(ps[0].innerHTML).toBe('otakustay@gmail.com');
        expect(h4s[1].innerHTML).toBe('errorrik');
        expect(ps[1].innerHTML).toBe('errorrik@gmail.com');

        expect(h3s.length).toBe(2);

        myComponent.data.pop('persons');
        san.nextTick(function () {
            var h4s = wrap.getElementsByTagName('h4');
            var ps = wrap.getElementsByTagName('p');
            expect(h4s.length).toBe(1);
            expect(ps.length).toBe(1);
            expect(h3s.length).toBe(2);


            expect(h4s[0].innerHTML).toBe('otakustay');
            expect(ps[0].innerHTML).toBe('otakustay@gmail.com');


            myComponent.data.unshift('persons', {name: 'errorrik', email: 'errorrik@gmail.com'});
            san.nextTick(function () {
                expect(h4s[0].innerHTML).toBe('errorrik');
                expect(ps[0].innerHTML).toBe('errorrik@gmail.com');

                expect(h4s[1].innerHTML).toBe('otakustay');
                expect(ps[1].innerHTML).toBe('otakustay@gmail.com');


                expect(h4s.length).toBe(2);
                expect(ps.length).toBe(2);
                expect(h3s.length).toBe(2);
                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            });
        });
    });

    it("render list with template, template has no sibling, no data, set soon", function (done) {
        var MyComponent = san.defineComponent({
            initData: function () {
                return {
                    persons: []
                };
            },

            template: '<div><template san-for="p,i in persons">  <h4>{{p.name}}</h4><p>{{p.email}}</p></template></div>'
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var h4s = wrap.getElementsByTagName('h4');
        var ps = wrap.getElementsByTagName('p');

        expect(h4s.length).toBe(0);
        expect(ps.length).toBe(0);

        myComponent.data.set('persons', [
            {name: 'otakustay', email: 'otakustay@gmail.com'},
            {name: 'errorrik', email: 'errorrik@gmail.com'}
        ]);

        san.nextTick(function () {
            var h4s = wrap.getElementsByTagName('h4');
            var ps = wrap.getElementsByTagName('p');
            expect(h4s.length).toBe(2);
            expect(ps.length).toBe(2);

            expect(h4s[0].innerHTML).toBe('otakustay');
            expect(ps[0].innerHTML).toBe('otakustay@gmail.com');
            expect(h4s[1].innerHTML).toBe('errorrik');
            expect(ps[1].innerHTML).toBe('errorrik@gmail.com');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("render list with template, template has no sibling, pop and unshift soon", function (done) {
        var MyComponent = san.defineComponent({
            initData: function () {
                return {
                    persons: [
                        {name: 'otakustay', email: 'otakustay@gmail.com'},
                        {name: 'errorrik', email: 'errorrik@gmail.com'}
                    ]
                };
            },

            template: '<div><template san-for="p,i in persons">  <h4>{{p.name}}</h4><p>{{p.email}}</p></template></div>'
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var h4s = wrap.getElementsByTagName('h4');
        var ps = wrap.getElementsByTagName('p');

        expect(h4s.length).toBe(2);
        expect(ps.length).toBe(2);

        expect(h4s[0].innerHTML).toBe('otakustay');
        expect(ps[0].innerHTML).toBe('otakustay@gmail.com');
        expect(h4s[1].innerHTML).toBe('errorrik');
        expect(ps[1].innerHTML).toBe('errorrik@gmail.com');


        myComponent.data.pop('persons');
        san.nextTick(function () {
            var h4s = wrap.getElementsByTagName('h4');
            var ps = wrap.getElementsByTagName('p');
            expect(h4s.length).toBe(1);
            expect(ps.length).toBe(1);


            expect(h4s[0].innerHTML).toBe('otakustay');
            expect(ps[0].innerHTML).toBe('otakustay@gmail.com');


            myComponent.data.unshift('persons', {name: 'errorrik', email: 'errorrik@gmail.com'});
            san.nextTick(function () {
                expect(h4s[0].innerHTML).toBe('errorrik');
                expect(ps[0].innerHTML).toBe('errorrik@gmail.com');

                expect(h4s[1].innerHTML).toBe('otakustay');
                expect(ps[1].innerHTML).toBe('otakustay@gmail.com');


                expect(h4s.length).toBe(2);
                expect(ps.length).toBe(2);
                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            });
        });
    });

    it("render list, no data, set and push soon", function (done) {
        var MyComponent = san.defineComponent({
            initData: function () {
                return {
                };
            },

            template: '<ul><li san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li></ul>'
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');

        expect(lis.length).toBe(0);

        myComponent.data.set('persons',
            [{name: 'otakustay', email: 'otakustay@gmail.com'}]
        );
        myComponent.data.push('persons',
            {name: 'errorrik', email: 'errorrik@gmail.com'}
        );

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(2);
            expect(lis[0].getAttribute('title')).toBe('otakustay');
            expect(lis[0].innerHTML.indexOf('otakustay - otakustay@gmail.com')).toBe(0);
            expect(lis[1].getAttribute('title')).toBe('errorrik');
            expect(lis[1].innerHTML.indexOf('errorrik - errorrik@gmail.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("render list, no data, set and unshift soon", function (done) {
        var MyComponent = san.defineComponent({
            initData: function () {
                return {
                };
            },

            template: '<ul><li san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li></ul>'
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');

        expect(lis.length).toBe(0);

        myComponent.data.set('persons',
            [{name: 'otakustay', email: 'otakustay@gmail.com'}]
        );
        myComponent.data.unshift('persons',
            {name: 'errorrik', email: 'errorrik@gmail.com'}
        );

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(2);
            expect(lis[1].getAttribute('title')).toBe('otakustay');
            expect(lis[1].innerHTML.indexOf('otakustay - otakustay@gmail.com')).toBe(0);
            expect(lis[0].getAttribute('title')).toBe('errorrik');
            expect(lis[0].innerHTML.indexOf('errorrik - errorrik@gmail.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("render list, no data, set and pop soon", function (done) {
        var MyComponent = san.defineComponent({
            initData: function () {
                return {
                };
            },

            template: '<ul><li san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li></ul>'
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');

        expect(lis.length).toBe(0);

        myComponent.data.set('persons',
            [
                {name: 'otakustay', email: 'otakustay@gmail.com'},
                {name: 'errorrik', email: 'errorrik@gmail.com'}
            ]
        );
        myComponent.data.pop('persons');

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(1);
            expect(lis[0].getAttribute('title')).toBe('otakustay');
            expect(lis[0].innerHTML.indexOf('otakustay - otakustay@gmail.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("render list, no data, set and shift soon", function (done) {
        var MyComponent = san.defineComponent({
            initData: function () {
                return {
                };
            },

            template: '<ul><li san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li></ul>'
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');

        expect(lis.length).toBe(0);

        myComponent.data.set('persons',
            [
                {name: 'otakustay', email: 'otakustay@gmail.com'},
                {name: 'errorrik', email: 'errorrik@gmail.com'}
            ]
        );
        myComponent.data.shift('persons');

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(1);
            expect(lis[0].getAttribute('title')).toBe('errorrik');
            expect(lis[0].innerHTML.indexOf('errorrik - errorrik@gmail.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("render list, push soon, no strange node in page", function (done) {
        var MyComponent = san.defineComponent({
            initData: function () {
                return {
                    persons: [{name: 'errorrik', email: 'errorrik@gmail.com'}]
                };
            },

            template: '<ul style="margin:0;padding:0;border:0;list-style:none"><li style="margin:0;padding:0;border:0;height:22px" san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li></ul>'
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis[0].getAttribute('title')).toBe('errorrik');
        expect(lis[0].innerHTML.indexOf('errorrik - errorrik@gmail.com')).toBe(0);
        expect(lis.length).toBe(1);

        var itemHeight = lis[0].offsetHeight;
        expect(lis[0].parentNode.offsetHeight).toBe(itemHeight);


        var newLen = myComponent.data.push('persons',
            {name: 'otakustay', email: 'otakustay@gmail.com'}
        );
        expect(newLen).toBe(2);

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(2);
            expect(lis[1].getAttribute('title')).toBe('otakustay');
            expect(lis[1].innerHTML.indexOf('otakustay - otakustay@gmail.com')).toBe(0);

            expect(lis[0].parentNode.offsetHeight).toBe(itemHeight * 2);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("data push after attach", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li>name - email</li><li san-for="p,i in persons" title="{{p.name}} {{i+1}}/{{persons.length}}">{{p.name}} - {{p.email}}</li><li>name - email</li></ul>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('persons', [
            {name: 'errorrik', email: 'errorrik@gmail.com'},
            {name: 'varsha', email: 'wangshuonpu@163.com'}
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(4);
        expect(lis[2].getAttribute('title')).toBe('varsha 2/2');

        myComponent.data.push('persons',
            {name: 'otakustay', email: 'otakustay@gmail.com'}
        );

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(5);
            expect(lis[2].getAttribute('title')).toBe('varsha 2/3');
            expect(lis[3].getAttribute('title')).toBe('otakustay 3/3');
            expect(lis[3].innerHTML.indexOf('otakustay - otakustay@gmail.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("data push after attach", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><ul san-for="col in cols">'
                + '<li san-for="item in col.list" title="{{item.title}}">{{item.title}}</li>'
                + '</ul></div>',

            initData: function () {
                return {
                    cols: [
                        {list: []}
                    ]
                };
            }
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(0);

        myComponent.data.push('cols[0].list', {title: 'title'});

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(1);
            expect(lis[0].title).toBe('title');
            expect(myComponent.data.get('cols[0].list[0].title')).toBe('title');


            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("data pop after attach", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li>name - email</li><li san-for="p,i in persons" title="{{p.name}} {{i+1}}/{{persons.length}}">{{p.name}} - {{p.email}}</li><li>name - email</li></ul>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('persons', [
            {name: 'errorrik', email: 'errorrik@gmail.com'},
            {name: 'varsha', email: 'wangshuonpu@163.com'}
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(4);
        expect(lis[1].getAttribute('title')).toBe('errorrik 1/2');

        myComponent.data.pop('persons');

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(3);
            expect(lis[1].getAttribute('title')).toBe('errorrik 1/1');
            expect(lis[1].innerHTML.indexOf('errorrik - errorrik@gmail.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("data unshift after attach", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li>name - email</li><li san-for="p,i in persons" title="{{p.name}} {{i+1}}/{{persons.length}}">{{p.name}} - {{p.email}}</li><li>name - email</li></ul>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('persons', [
            {name: 'one', email: 'one@gmail.com'},
            {name: 'two', email: 'two@gmail.com'}
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(4);
        expect(lis[1].getAttribute('title')).toBe('one 1/2');
        expect(lis[1].innerHTML.indexOf('one - one@gmail.com')).toBe(0);

        var newLen = myComponent.data.unshift('persons',
            {name: 'three', email: 'three@gmail.com'}
        );
        expect(newLen).toBe(3);

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(5);

            expect(lis[3].getAttribute('title')).toBe('two 3/3');
            expect(lis[3].innerHTML.indexOf('two - two@gmail.com')).toBe(0);
            expect(lis[2].getAttribute('title')).toBe('one 2/3');
            expect(lis[1].getAttribute('title')).toBe('three 1/3');
            expect(lis[1].innerHTML.indexOf('three - three@gmail.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("data shift after attach", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li>name - email</li><li san-for="p,i in persons" title="{{p.name}} {{i+1}}/{{persons.length}}">{{p.name}} - {{p.email}}</li><li>name - email</li></ul>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('persons', [
            {name: 'errorrik', email: 'errorrik@gmail.com'},
            {name: 'varsha', email: 'wangshuonpu@163.com'}
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(4);
        expect(lis[1].getAttribute('title')).toBe('errorrik 1/2');
        expect(lis[2].getAttribute('title')).toBe('varsha 2/2');

        myComponent.data.shift('persons');

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(3);
            expect(lis[1].getAttribute('title')).toBe('varsha 1/1');
            expect(lis[1].innerHTML.indexOf('varsha - wangshuonpu@163.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("data remove after attach", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li>name - email</li><li san-for="p,i in persons" title="{{p.name}} {{i+1}}/{{persons.length}}">{{p.name}} - {{p.email}}</li><li>name - email</li></ul>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('persons', [
            {name: 'one', email: 'one@gmail.com'},
            {name: 'two', email: 'two@gmail.com'}
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(4);
        expect(lis[1].getAttribute('title')).toBe('one 1/2');
        expect(lis[1].innerHTML.indexOf('one - one@gmail.com')).toBe(0);

        myComponent.data.removeAt('persons', 0);

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(3);
            expect(lis[1].getAttribute('title')).toBe('two 1/1');
            expect(lis[1].innerHTML.indexOf('two - two@gmail.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("data splice after attach, just remove", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li>name - email</li><li san-for="p,i in persons" title="{{p.name}} {{i+1}}/{{persons.length}}">{{p.name}} - {{p.email}}</li><li>name - email</li></ul>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('persons', [
            {name: 'one', email: 'one@gmail.com'},
            {name: 'two', email: 'two@gmail.com'},
            {name: 'three', email: 'three@gmail.com'},
            {name: 'four', email: 'four@gmail.com'},
            {name: 'five', email: 'five@gmail.com'}
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(7);
        expect(lis[1].getAttribute('title')).toBe('one 1/5');
        expect(lis[2].getAttribute('title')).toBe('two 2/5');

        myComponent.data.splice('persons', [1, 3]);


        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(4);
            expect(lis[1].getAttribute('title')).toBe('one 1/2');
            expect(lis[2].getAttribute('title')).toBe('five 2/2');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("data splice after attach, remove and insert", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li>name - email</li><li san-for="p,i in persons" title="{{p.name}} {{i+1}}/{{persons.length}}">{{p.name}} - {{p.email}}</li><li>name - email</li></ul>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('persons', [
            {name: 'one', email: 'one@gmail.com'},
            {name: 'two', email: 'two@gmail.com'},
            {name: 'three', email: 'three@gmail.com'},
            {name: 'four', email: 'four@gmail.com'},
            {name: 'five', email: 'five@gmail.com'}
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(7);
        expect(lis[1].getAttribute('title')).toBe('one 1/5');
        expect(lis[2].getAttribute('title')).toBe('two 2/5');

        myComponent.data.splice('persons', [
            1, 3,
            {name: 'six', email: 'six@gmail.com'},
            {name: 'seven', email: 'seven@gmail.com'}
        ]);


        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(6);
            expect(lis[1].getAttribute('title')).toBe('one 1/4');
            expect(lis[2].getAttribute('title')).toBe('six 2/4');
            expect(lis[3].getAttribute('title')).toBe('seven 3/4');
            expect(lis[4].getAttribute('title')).toBe('five 4/4');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("data set after attach", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li>name - email</li><li san-for="p,i in persons" title="{{p.name}} {{i+1}}/{{persons.length}}">{{p.name}} - {{p.email}}</li><li>name - email</li></ul>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('persons', [
            {name: 'errorrik', email: 'errorrik@gmail.com'},
            {name: 'varsha', email: 'wangshuonpu@163.com'}
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(4);
        expect(lis[1].getAttribute('title')).toBe('errorrik 1/2');

        myComponent.data.set('persons[0]', {name: 'erik', email: 'erik168@163.com'});

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(4);
            expect(lis[1].getAttribute('title')).toBe('erik 1/2');
            expect(lis[1].innerHTML.indexOf('erik - erik168@163.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("data set null after attach, has no sibling", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li san-for="p,i in persons" title="{{p.name}} {{i+1}}/{{persons.length}}">{{p.name}} - {{p.email}}</li></ul>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('persons', [
            {name: 'errorrik', email: 'errorrik@gmail.com'},
            {name: 'varsha', email: 'wangshuonpu@163.com'}
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(2);
        expect(lis[0].getAttribute('title')).toBe('errorrik 1/2');

        myComponent.data.set('persons', null);

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });


    it("data set null after attach, has 2side sibling", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li>name - email</li><li san-for="p,i in persons" title="{{p.name}} {{i+1}}/{{persons.length}}">{{p.name}} - {{p.email}}</li><li>name - email</li></ul>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('persons', [
            {name: 'errorrik', email: 'errorrik@gmail.com'},
            {name: 'varsha', email: 'wangshuonpu@163.com'}
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(4);
        expect(lis[1].getAttribute('title')).toBe('errorrik 1/2');

        myComponent.data.set('persons', null);

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(2);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("data set after attach, for in tr should warning parent(tbody) in chrome", function (done) {
        // dont run this spec in ie
        if (/msie/i.test(navigator.userAgent)) {
            done();
            return;
        }

        var MyComponent = san.defineComponent({
            template: '<div><table><thead><tr><th>name</th><th>email</th></tr></thead>' +
                '<tbody><tr title="{{p.name}}" san-for="p,i in persons"><td>{{p.name}}</td><td>{{p.email}}</td></tr></tbody></table></div>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('persons', [
            {name: 'errorrik', email: 'errorrik@gmail.com'},
            {name: 'firede', email: 'firede@gmail.com'}
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var trs = wrap.getElementsByTagName('tr');
        expect(trs.length).toBe(3);

        myComponent.data.set('persons', [
            {name: 'otakustay', email: 'otakustay@gmail.com'}
        ]);

        san.nextTick(function () {
            var trs = wrap.getElementsByTagName('tr');
            expect(trs.length).toBe(2);
            expect(trs[1].getAttribute('title')).toBe('otakustay');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("data item prop set after attach", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li>name - email</li><li san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li><li>name - email</li></ul>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('persons', [
            {name: 'errorrik', email: 'errorrik@gmail.com'},
            {name: 'varsha', email: 'wangshuonpu@163.com'}
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(4);

        myComponent.data.set('persons[0].name', 'erik');

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(4);
            expect(lis[1].getAttribute('title')).toBe('erik');
            expect(lis[1].innerHTML.indexOf('erik - errorrik@gmail.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("data item set after attach", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li>name - email</li><li san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li><li>name - email</li></ul>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('persons', [
            {name: 'errorrik', email: 'errorrik@gmail.com'},
            {name: 'varsha', email: 'wangshuonpu@163.com'}
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(4);

        myComponent.data.set('persons[0]', {name: 'otakustay', email: 'otakustay@gmail.com'});

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(4);
            expect(lis[1].getAttribute('title')).toBe('otakustay');
            expect(lis[1].innerHTML.indexOf('otakustay - otakustay@gmail.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("data set after attach(has two side sibling)", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li>name - email</li><li san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li><li>name - email</li></ul>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('persons', [
            {name: 'errorrik', email: 'errorrik@gmail.com'},
            {name: 'varsha', email: 'wangshuonpu@163.com'}
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(4);

        myComponent.data.set('persons', [
            {name: 'otakustay', email: 'otakustay@gmail.com'}
        ]);

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(3);
            expect(lis[1].getAttribute('title')).toBe('otakustay');
            expect(lis[1].innerHTML.indexOf('otakustay - otakustay@gmail.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("data set after attach(has last sibling, no first sibling)", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li><li>name - email</li></ul>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('persons', [
            {name: 'errorrik', email: 'errorrik@gmail.com'},
            {name: 'any', email: 'anyone@163.com'}
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(3);

        myComponent.data.set('persons', [
            {name: 'otakustay', email: 'otakustay@gmail.com'}
        ]);

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(2);
            expect(lis[0].getAttribute('title')).toBe('otakustay');
            expect(lis[0].innerHTML.indexOf('otakustay - otakustay@gmail.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("data set after attach(has last sibling, no first sibling, start with empty data)", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li><li>name - email</li></ul>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('persons', []);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(1);

        myComponent.data.set('persons', [
            {name: 'otakustay', email: 'otakustay@gmail.com'}
        ]);

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(2);
            expect(lis[0].getAttribute('title')).toBe('otakustay');
            expect(lis[0].innerHTML.indexOf('otakustay - otakustay@gmail.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("data item set after attach", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li>name - email</li><li san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}} in {{org}}</li><li>name - email</li></ul>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('persons', [
            {name: 'errorrik', email: 'errorrik@gmail.com'},
            {name: 'varsha', email: 'wangshuonpu@163.com'}
        ]);
        myComponent.data.set('org', 'efe');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');

        expect(lis.length).toBe(4);
        expect(lis[1].getAttribute('title')).toBe('errorrik');
        expect(lis[1].innerHTML.indexOf('errorrik - errorrik@gmail.com in efe')).toBe(0);

        myComponent.data.set('org', 'MMSFE');

        san.nextTick(function () {
            expect(lis[1].getAttribute('title')).toBe('errorrik');
            expect(lis[1].innerHTML.indexOf('errorrik - errorrik@gmail.com in MMSFE')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("no data before attach, data set after attach", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li></ul>'
        });
        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(0);

        myComponent.data.set('persons', [
            {name: 'otakustay', email: 'otakustay@gmail.com'}
        ]);

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(1);
            expect(lis[0].getAttribute('title')).toBe('otakustay');
            expect(lis[0].innerHTML.indexOf('otakustay - otakustay@gmail.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("update not item data", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul>\n'
                + '    <li san-for="item in winner.winUsers">\n'
                + '        <b>{{winner.issueNo}}</b>\n'
                + '        <u>{{item.luckyNo}}</u>\n'
                + '    </li>\n'
                + '</ul>'
        });
        var myComponent = new MyComponent({
            data: {
                winner: {
                    issueNo: 'one',
                    winUsers: [
                        {
                            luckyNo: '123'
                        },
                        {
                            luckyNo: '456'
                        }
                    ]
                }
            }
        });
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(2);
        expect(lis[0].getElementsByTagName('b')[0].innerHTML).toBe('one');
        expect(lis[0].getElementsByTagName('u')[0].innerHTML).toBe('123');
        expect(lis[1].getElementsByTagName('b')[0].innerHTML).toBe('one');
        expect(lis[1].getElementsByTagName('u')[0].innerHTML).toBe('456');

        myComponent.data.set('winner', {
            issueNo: 'two',
            winUsers: [
                {
                    luckyNo: '789'
                },
                {
                    luckyNo: '890'
                },
                {
                    luckyNo: 'abc'
                }
            ]
        });

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(3);
            expect(lis[0].getElementsByTagName('b')[0].innerHTML).toBe('two');
            expect(lis[0].getElementsByTagName('u')[0].innerHTML).toBe('789');
            expect(lis[1].getElementsByTagName('b')[0].innerHTML).toBe('two');
            expect(lis[1].getElementsByTagName('u')[0].innerHTML).toBe('890');
            expect(lis[2].getElementsByTagName('b')[0].innerHTML).toBe('two');
            expect(lis[2].getElementsByTagName('u')[0].innerHTML).toBe('abc');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("multi data set after attach, that will influence exists item which should be removed", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><a san-for="item, index in list" title="{{dep}} {{item.name}}">{{dep}} {{item.name}}</a></div>'
        });
        var myComponent = new MyComponent({
            data: {
                list: [
                    {name: 'one'},
                    {name: 'two'}
                ],
                dep: 'dep'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var aEls = wrap.getElementsByTagName('a');

        expect(aEls.length).toBe(2);
        expect(aEls[0].getAttribute('title')).toBe('dep one');
        expect(aEls[0].innerHTML.indexOf('dep one')).toBe(0);
        expect(aEls[1].getAttribute('title')).toBe('dep two');
        expect(aEls[1].innerHTML.indexOf('dep two')).toBe(0);

        myComponent.data.set('list', [
            {name: 'three'}
        ]);
        myComponent.data.set('dep', 'DEPT');

        san.nextTick(function () {
             var aEls = wrap.getElementsByTagName('a');

            expect(aEls.length).toBe(1);
            expect(aEls[0].getAttribute('title')).toBe('DEPT three');
            expect(aEls[0].innerHTML.indexOf('DEPT three')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("nested, data fill before attach", function () {
        var MyComponent = san.defineComponent({
            template: '<ul><li>name - email</li><li san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}<b san-for="tel in p.tels">{{tel}}</b></li></ul>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('persons', [
            {name: 'errorrik', email: 'errorrik@gmail.com', tels: ['12345678', '87654321']},
            {name: 'varsha', email: 'wangshuonpu@163.com', tels: ['23456789', '98765432']}
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');

        expect(lis.length).toBe(3);

        expect(lis[2].getAttribute('title')).toBe('varsha');
        expect(lis[2].innerHTML.indexOf('varsha - wangshuonpu@163.com')).toBe(0);
        var lis2bs = lis[2].getElementsByTagName('b');
        expect(lis2bs[0].innerHTML.indexOf('23456789')).toBe(0);
        expect(lis2bs[1].innerHTML.indexOf('98765432')).toBe(0);

        expect(lis[1].getAttribute('title')).toBe('errorrik');
        expect(lis[1].innerHTML.indexOf('errorrik - errorrik@gmail.com')).toBe(0);
        var lis1bs = lis[1].getElementsByTagName('b');
        expect(lis1bs[0].innerHTML.indexOf('12345678')).toBe(0);
        expect(lis1bs[1].innerHTML.indexOf('87654321')).toBe(0);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("nested, data fill after attach", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}<b san-for="tel in p.tels">{{tel}}</b></li></ul>'
        });
        var myComponent = new MyComponent();


        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(0);

        myComponent.data.set('persons', [
            {name: 'errorrik', email: 'errorrik@gmail.com', tels: ['12345678', '87654321']},
            {name: 'varsha', email: 'wangshuonpu@163.com', tels: ['23456789', '98765432']}
        ]);

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');

            expect(lis[1].getAttribute('title')).toBe('varsha');
            expect(lis[1].innerHTML.indexOf('varsha - wangshuonpu@163.com')).toBe(0);
            var lis2bs = lis[1].getElementsByTagName('b');
            expect(lis2bs[0].innerHTML.indexOf('23456789')).toBe(0);
            expect(lis2bs[1].innerHTML.indexOf('98765432')).toBe(0);

            expect(lis[0].getAttribute('title')).toBe('errorrik');
            expect(lis[0].innerHTML.indexOf('errorrik - errorrik@gmail.com')).toBe(0);
            var lis1bs = lis[0].getElementsByTagName('b');
            expect(lis1bs[0].innerHTML.indexOf('12345678')).toBe(0);
            expect(lis1bs[1].innerHTML.indexOf('87654321')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });

    });


    it("use index to refer other object", function () {
        var MyComponent = san.defineComponent({
            template: '<ul><li san-for="p,i in persons" title="{{colors[i]}}">{{colors[i]}}</li></ul>',
            initData: function () {
                return {
                    persons: [
                        {name: 'errorrik', email: 'errorrik@gmail.com'}
                    ],

                    colors: ['red']
                }
            }
        });
        var myComponent = new MyComponent();


        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis[0].title).toBe('red');

        myComponent.dispose();
        document.body.removeChild(wrap);

    });

    it("dom event in for", function (done) {
        var clickValue = 0;
        var MyComponent = san.defineComponent({
            template: '<ul><li san-for="p in list" on-click="clicker(p)">{{p}}</li></ul>',
            initData: function () {
                return {
                    list: [1, 2, 3]
                };
            },

            clicker: function (p) {
                clickValue = p;
            }
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(clickValue).toBe(0);

        var lis = wrap.getElementsByTagName('li');
        triggerEvent('#' + lis[0].id, 'click');

        san.nextTick(function () {
            expect(clickValue > 0).toBeTruthy();


            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("component custom event in for", function (done) {
        var clickValue = [];
        var Button = san.defineComponent({
            template: '<button><slot></slot></button>',

            attached: function () {
                this.fire('click');
            }
        });

        var MyComponent = san.defineComponent({
            template: '<p><ui-button san-for="p in list" on-click="clicker(p)">{{p}}</ui-button></p>',
            initData: function () {
                return {
                    list: [1, 2, 3]
                };
            },

            components: {
                'ui-button': Button
            },

            clicker: function (p) {
                clickValue.push(p);
            }
        });


        expect(clickValue.length).toBe(0);

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);


        expect(clickValue.length).toBe(3);
        expect(clickValue[0]).toBe(1);
        expect(clickValue[1]).toBe(2);
        expect(clickValue[2]).toBe(3);

        myComponent.dispose();
        document.body.removeChild(wrap);
        done();

    });

    it("in no tbody declaration, may append in right position", function (done) {
        if (/msie/i.test(navigator.userAgent)) {
            done();
            return;
        }

        var MyComponent = san.defineComponent({
            template: '<table cellpadding="0" cellspacing="0" width="100">'
                + '<tr><th san-for="item in schema">{{item.label}}</th></tr>'
                + '<tr s-for="item in datasource">'
                + '<td s-for="col in schema">{{item[col.name]}}</td>'
                + '</tr>'
            + '</table>'
        });


        var myComponent = new MyComponent({
            data: {
                schema: [
                    {name: 'name', label: 'Name'},
                    {name: 'age', label: 'Age'}
                ],

                datasource: [
                    {name: 'foo', age: 5}
                ]
            }
        });
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);


        var tr0 = wrap.getElementsByTagName('tr')[0];
        var trParent = tr0.parentNode;


        myComponent.data.push('datasource', {name: 'xxx', age: 10});
        myComponent.data.push('datasource', {name: 'yyy', age: 20});

        san.nextTick(function () {
            var trs = wrap.getElementsByTagName('tr');
            for (var i = 0; i < trs.length; i++) {
                expect(trs[i].parentNode).toBe(trParent)
            }

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("input checked in item", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul>'
                + '<li s-for="item in list"><input type="checkbox" value="{{item.value}}" checked="{{value}}">{{item.text}}</li>'
            + '</ul>'
        });


        var myComponent = new MyComponent({
            data: {
                value: ['bar'],
                list: [
                    {text: 'foo', value: 'foo'},
                    {text: 'bar', value: 'bar'}
                ]
            }
        });
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);


        var inputs = wrap.getElementsByTagName('input');
        expect(inputs[0].checked).toBeFalsy();
        expect(inputs[1].checked).toBeTruthy();


        myComponent.data.set('list[1].value', 'bar2');
        myComponent.data.set('list[0].value', 'bar');

        san.nextTick(function () {
            var inputs = wrap.getElementsByTagName('input');
            expect(inputs[1].checked).toBeFalsy();
            expect(inputs[0].checked).toBeTruthy();

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("merge different kinds of changes in the same tick", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul>'
                + '<li s-for="item, index in items">{{item}}</li>'
            + '</ul>',
            attached: function () {
                this.data.set('items', ['errorrik', 'otakustay']);
                this.data.push('items', 'dafrok');
            }
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');

            expect(lis.length).toBe(3);
            expect(lis[0].innerHTML).toBe('errorrik');
            expect(lis[1].innerHTML).toBe('otakustay');
            expect(lis[2].innerHTML).toBe('dafrok');
            expect(lis[3]).toBe(undefined);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("render list, set list and set other data soon", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li san-for="p in persons" title="in {{dep}}">{{p.name}}</li></ul>'
        });
        var myComponent = new MyComponent({
            data: {
                persons: [
                    {name: 'otakustay'}
                ],
                dep: 'tg'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(1);
        expect(lis[0].title).toBe('in tg');
        expect(lis[0].innerHTML).toBe('otakustay');


        myComponent.data.set('persons',
            [
                {name: 'Justineo'},
                {name: 'errorrik'}
            ]
        );
        myComponent.data.set('dep', 'ssg');

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(2);
            expect(lis[0].title).toBe('in ssg');
            expect(lis[0].innerHTML).toBe('Justineo');
            expect(lis[1].title).toBe('in ssg');
            expect(lis[1].innerHTML).toBe('errorrik');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });


    it("render list,  set other data and set list soon", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li san-for="p in persons" title="in {{dep}}">{{p.name}}</li></ul>'
        });
        var myComponent = new MyComponent({
            data: {
                persons: [
                    {name: 'otakustay'}
                ],
                dep: 'tg'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(1);
        expect(lis[0].title).toBe('in tg');
        expect(lis[0].innerHTML).toBe('otakustay');


        myComponent.data.set('dep', 'ssg');
        myComponent.data.set('persons',
            [
                {name: 'Justineo'},
                {name: 'errorrik'}
            ]
        );

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(2);
            expect(lis[0].title).toBe('in ssg');
            expect(lis[0].innerHTML).toBe('Justineo');
            expect(lis[1].title).toBe('in ssg');
            expect(lis[1].innerHTML).toBe('errorrik');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("list data (Array) has string property directly, dont throw error", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><h3>{{list.title}}</h3><p s-for="item in list">{{list.title}} {{item}}</p></div>'
        });

        var data = {
            list: ['otakustay']
        };
        data.list.title = "super";

        var myComponent = new MyComponent({
            data: data
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var ps = wrap.getElementsByTagName('p');
        expect(ps.length).toBe(1);
        expect(ps[0].innerHTML).toBe('super otakustay');

        var h3 = wrap.getElementsByTagName('h3')[0];
        expect(h3.innerHTML).toBe('super');

        myComponent.data.push('list', 'errorrik');
        myComponent.data.set('list.title', 'good');

        san.nextTick(function () {
            var ps = wrap.getElementsByTagName('p');
            expect(ps.length).toBe(2);
            expect(ps[0].innerHTML).toBe('good otakustay');
            expect(ps[1].innerHTML).toBe('good errorrik');
            var h3 = wrap.getElementsByTagName('h3')[0];
            expect(h3.innerHTML).toBe('good');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("nest in template node", function (done) {
        var MyComponent = san.defineComponent({
            filters: {
                arr: function (value) {
                    return value.join('|')
                }
            },
            template: '<div><template s-for="row in rows">'
                + '<p s-for="subRow in row.childs">'
                + '<b>{{subRow.channels|arr}}</b>'
                + '<input type="checkbox" value="foo" checked="{=subRow.channels=}" />'
                + '<input type="checkbox" value="bar" checked="{=subRow.channels=}" />'
                + '</p>'
            + '</template></div>'
        });


        var myComponent = new MyComponent({
            data: {
                rows: [
                    {
                        childs: [
                            {channels: ['foo']}
                        ]
                    },
                    {
                        childs: [
                            {channels: ['bar']}
                        ]
                    }
                ]
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var bs = wrap.getElementsByTagName('b');
        expect(bs.length).toBe(2);
        expect(bs[0].innerHTML).toContain('foo');
        expect(bs[1].innerHTML).toContain('bar');


        var inputs = wrap.getElementsByTagName('input');
        expect(inputs[0].checked).toBeTruthy();
        expect(inputs[1].checked).not.toBeTruthy();
        expect(inputs[2].checked).not.toBeTruthy();
        expect(inputs[3].checked).toBeTruthy();

        myComponent.data.push('rows[1].childs[0].channels', 'foo');

        san.nextTick(function () {
            var bs = wrap.getElementsByTagName('b');
            expect(bs.length).toBe(2);
            expect(bs[0].innerHTML).toContain('foo');
            expect(bs[1].innerHTML).toContain('bar|foo');


            var inputs = wrap.getElementsByTagName('input');
            expect(inputs[0].checked).toBeTruthy();
            expect(inputs[1].checked).not.toBeTruthy();
            expect(inputs[2].checked).toBeTruthy();
            expect(inputs[3].checked).toBeTruthy();

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("with component, splice more than once", function (done) {

        var A = san.defineComponent({
            template: '<li>{{index}}-{{name}}</li>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-a': A
            },
            template: '<ul><x-a s-for="p, index in list" index="{{index}}" name="{{p}}"/></ul>'
        });

        var myComponent = new MyComponent({
            data: {
                list: ['one', 'two']
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(2);
        expect(lis[0].innerHTML).toContain('0-one');
        expect(lis[1].innerHTML).toContain('1-two');

        myComponent.data.splice('list', [0, 0, 'three']);
        myComponent.data.splice('list', [0, 0, 'four', 'five']);


        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(5);
            expect(lis[0].innerHTML).toContain('0-four');
            expect(lis[1].innerHTML).toContain('1-five');
            expect(lis[2].innerHTML).toContain('2-three');
            expect(lis[3].innerHTML).toContain('3-one');
            expect(lis[4].innerHTML).toContain('4-two');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });
});
