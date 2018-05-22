/* JSModeler 0.42 - http://www.github.com/kovacsv/JSModeler */ "use strict";
JSM.GenerateText = function(k, m, f, n, p) {
    var l = new JSM.Model(),
        h = new JSM.Vector2D(0, 0);
    f = new JSM.Coord2D(f, f);
    var g, e, c;
    for (g = 0; g < k.length; g++)
        if (((e = k[g]), (e = m.glyphs[e]), void 0 !== e)) {
            var b = e.o;
            c = new JSM.Path2D({ segmentation: p, offset: h, scale: f });
            for (var b = b.split(" "), a = 0, d = void 0; a < b.length; )
                (d = b[a++]),
                    0 !== d.length &&
                        ("m" == d
                            ? (c.MoveTo(
                                  parseFloat(b[a + 0]),
                                  parseFloat(b[a + 1])
                              ),
                              (a += 2))
                            : "l" == d
                              ? (c.LineTo(
                                    parseFloat(b[a + 0]),
                                    parseFloat(b[a + 1])
                                ),
                                (a += 2))
                              : "b" == d
                                ? (c.CubicBezierTo(
                                      parseFloat(b[a + 0]),
                                      parseFloat(b[a + 1]),
                                      parseFloat(b[a + 2]),
                                      parseFloat(b[a + 3]),
                                      parseFloat(b[a + 4]),
                                      parseFloat(b[a + 5])
                                  ),
                                  (a += 6))
                                : "z" == d
                                  ? c.Close()
                                  : JSM.Message(
                                        "Invalid path command found: " + d
                                    ));
            c = JSM.GeneratePrismsFromPath2D(c, n, !0, 160 * JSM.DegRad);
            l.AddBodies(c);
            h.x += e.ha * f.x;
        }
    return l;
};
