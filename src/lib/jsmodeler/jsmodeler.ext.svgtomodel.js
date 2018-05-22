/* JSModeler 0.42 - http://www.github.com/kovacsv/JSModeler */ "use strict";
JSM.SvgToModel = function(n, x, t, z) {
    function A(a, g) {
        function h(a, b, c, e, d) {
            var h = a.createSVGPoint();
            h.x = e;
            h.y = d;
            a = h;
            c = c.getCTM();
            void 0 !== c && null !== c && (a = h.matrixTransform(c));
            c = new JSM.Coord2D(a.x, a.y);
            e = new JSM.Coord2D(e, d);
            b = b.GetLastContour();
            d = b.VertexCount();
            if (0 < d && b.GetVertex(d - 1).IsEqualWithEps(c, 0.1)) return e;
            b.AddVertex(a.x, a.y);
            return e;
        }
        function n(a, b, c, e, d, k) {
            var q = document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "path"
                ),
                m = "M " + e.x + " " + e.y + " ",
                l,
                f,
                g,
                p,
                y;
            for (l = 0; l < d.length; l++)
                if (
                    ((f = d[l]),
                    f.pathSegType == SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS ||
                        f.pathSegType == SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL)
                )
                    (g =
                        f.pathSegType == SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS
                            ? "C"
                            : "c"),
                        (m +=
                            g +
                            " " +
                            f.x1 +
                            " " +
                            f.y1 +
                            " " +
                            f.x2 +
                            " " +
                            f.y2 +
                            " " +
                            f.x +
                            " " +
                            f.y +
                            " ");
                else if (
                    f.pathSegType == SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS ||
                    f.pathSegType == SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL
                )
                    (g =
                        f.pathSegType ==
                        SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS
                            ? "Q"
                            : "q"),
                        (m +=
                            g +
                            " " +
                            f.x1 +
                            " " +
                            f.y1 +
                            " " +
                            f.x +
                            " " +
                            f.y +
                            " ");
                else if (
                    f.pathSegType == SVGPathSeg.PATHSEG_ARC_ABS ||
                    f.pathSegType == SVGPathSeg.PATHSEG_ARC_REL
                )
                    (g =
                        f.pathSegType == SVGPathSeg.PATHSEG_ARC_ABS
                            ? "A"
                            : "a"),
                        (p = f.largeArcFlag ? 1 : 0),
                        (y = f.sweepFlag ? 1 : 0),
                        (m +=
                            g +
                            " " +
                            f.r1 +
                            " " +
                            f.r2 +
                            " " +
                            f.angle +
                            " " +
                            p +
                            " " +
                            y +
                            " " +
                            f.x +
                            " " +
                            f.y +
                            " ");
                else if (
                    f.pathSegType ==
                        SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS ||
                    f.pathSegType == SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL
                )
                    (g =
                        f.pathSegType ==
                        SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS
                            ? "S"
                            : "s"),
                        (m +=
                            g +
                            " " +
                            f.x2 +
                            " " +
                            f.y2 +
                            " " +
                            f.x +
                            " " +
                            f.y +
                            " ");
            q.setAttributeNS(null, "d", m);
            m = q.getTotalLength();
            d = 0;
            0 < c && (d = parseInt(m / c, 10));
            3 > d && (d = 3);
            c = m / d;
            for (m = 1; m <= d; m++)
                (e = q.getPointAtLength(m * c)), (e = h(a, k, b, e.x, e.y));
            return e;
        }
        function l(a) {
            a = a.GetLastContour();
            var b = a.VertexCount();
            if (0 !== b) {
                var c = a.GetVertex(0),
                    b = a.GetVertex(b - 1);
                c.IsEqualWithEps(b, 0.1) && a.vertices.pop();
            }
        }
        function r(a) {
            0 < a.GetLastContour().VertexCount() && (l(a), a.AddContour());
        }
        var e = new JSM.ContourPolygon2D();
        e.AddContour();
        var k = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
            d;
        if (a instanceof SVGPathElement) {
            var c = new JSM.Coord2D(0, 0),
                p = new JSM.Coord2D(0, 0),
                s = g;
            a.hasAttribute("segmentlength") &&
                (s = parseFloat(a.getAttribute("segmentlength")));
            var b, q;
            for (d = 0; d < a.pathSegList.numberOfItems; d++)
                if (
                    ((b = a.pathSegList.getItem(d)),
                    b.pathSegType != SVGPathSeg.PATHSEG_CLOSEPATH)
                )
                    if (b.pathSegType == SVGPathSeg.PATHSEG_MOVETO_ABS)
                        r(e), (c = h(k, e, a, b.x, b.y)), (p = c.Clone());
                    else if (b.pathSegType == SVGPathSeg.PATHSEG_MOVETO_REL)
                        r(e),
                            (c = h(k, e, a, p.x + b.x, p.y + b.y)),
                            (p = c.Clone());
                    else if (b.pathSegType == SVGPathSeg.PATHSEG_LINETO_ABS)
                        c = h(k, e, a, b.x, b.y);
                    else if (b.pathSegType == SVGPathSeg.PATHSEG_LINETO_REL)
                        c = h(k, e, a, c.x + b.x, c.y + b.y);
                    else if (
                        b.pathSegType ==
                        SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_ABS
                    )
                        c = h(k, e, a, b.x, c.y);
                    else if (
                        b.pathSegType == SVGPathSeg.PATHSEG_LINETO_VERTICAL_ABS
                    )
                        c = h(k, e, a, c.x, b.y);
                    else if (
                        b.pathSegType ==
                        SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_REL
                    )
                        c = h(k, e, a, c.x + b.x, c.y);
                    else if (
                        b.pathSegType == SVGPathSeg.PATHSEG_LINETO_VERTICAL_REL
                    )
                        c = h(k, e, a, c.x, c.y + b.y);
                    else if (
                        b.pathSegType == SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS ||
                        b.pathSegType == SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL ||
                        b.pathSegType ==
                            SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS ||
                        b.pathSegType ==
                            SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL ||
                        b.pathSegType == SVGPathSeg.PATHSEG_ARC_ABS ||
                        b.pathSegType == SVGPathSeg.PATHSEG_ARC_REL ||
                        b.pathSegType ==
                            SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS ||
                        b.pathSegType ==
                            SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL
                    ) {
                        q = [];
                        if (
                            b.pathSegType ==
                                SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS ||
                            b.pathSegType ==
                                SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL
                        ) {
                            for (; d < a.pathSegList.numberOfItems; d++) {
                                b = a.pathSegList.getItem(d);
                                if (
                                    !(
                                        b.pathSegType ==
                                            SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS ||
                                        b.pathSegType ==
                                            SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL
                                    )
                                )
                                    break;
                                q.push(b);
                            }
                            d -= 1;
                        } else q.push(b);
                        c = n(k, a, s, c, q, e);
                    }
            l(e);
        } else if (a instanceof SVGRectElement)
            h(k, e, a, a.x.baseVal.value, a.y.baseVal.value),
                h(
                    k,
                    e,
                    a,
                    a.x.baseVal.value + a.width.baseVal.value,
                    a.y.baseVal.value
                ),
                h(
                    k,
                    e,
                    a,
                    a.x.baseVal.value + a.width.baseVal.value,
                    a.y.baseVal.value + a.height.baseVal.value
                ),
                h(
                    k,
                    e,
                    a,
                    a.x.baseVal.value,
                    a.y.baseVal.value + a.height.baseVal.value
                );
        else if (a instanceof SVGPolygonElement)
            for (d = 0; d < a.points.numberOfItems; d++)
                (c = a.points.getItem(d)), h(k, e, a, c.x, c.y);
        e.color = (function(a) {
            for (var b = ""; null !== a && void 0 !== a && 0 === b.length; )
                (b = a.getAttribute("fill")),
                    null === b && (b = a.style.fill),
                    (a = a.parentElement);
            a = 0;
            if (0 === b.length) return a;
            if ("#" == b[0]) a = JSM.HexColorToRGBColor(b.substring(1));
            else {
                var c = b.indexOf("("),
                    d = b.indexOf(")");
                if (-1 == c || -1 == d) return a;
                b = b.substring(c + 1, d).split(", ");
                if (3 != b.length) return a;
                a = JSM.RGBComponentsToHexColor(b[0], b[1], b[2]);
            }
            return a;
        })(a);
        e.originalElem = a;
        return e;
    }
    function B(a, g, h) {
        function n(a, b, c) {
            var d;
            if (c)
                for (c = a.VertexCount() - 1; 0 <= c; c--)
                    (d = a.GetVertex(c)), b.push(new JSM.Coord(d.x, -d.y, 0));
            else
                for (c = 0; c < a.VertexCount(); c++)
                    (d = a.GetVertex(c)), b.push(new JSM.Coord(d.x, -d.y, 0));
        }
        function l(a) {
            var b = [],
                c = a.GetOrientation() == JSM.Orientation.CounterClockwise;
            n(a, b, c);
            return b;
        }
        function r(a, b) {
            a.push(null);
            var c = b.GetOrientation() == JSM.Orientation.Clockwise;
            n(b, a, c);
        }
        var e = [],
            k = new JSM.Vector(0, 0, 1);
        void 0 !== a.originalElem &&
            a.originalElem.hasAttribute("modelheight") &&
            (g = parseFloat(a.originalElem.getAttribute("modelheight")));
        var d, c;
        c = a.ContourCount();
        if (0 === c) return null;
        if (1 == c)
            (c = a.GetContour(0).GetOrientation()),
                (d = l(a.GetContour(0))),
                (d = JSM.GeneratePrism(d, k, g, !0, h)),
                e.push(d);
        else if (1 < c) {
            c = a.GetContour(0).GetOrientation();
            var p = l(a.GetContour(0)),
                s = !1,
                b;
            for (b = 1; b < a.ContourCount(); b++)
                (d = a.GetContour(b).GetOrientation()),
                    d == c
                        ? ((d = l(a.GetContour(b))),
                          (d = JSM.GeneratePrism(d, k, g, !0, h)),
                          e.push(d))
                        : (r(p, a.GetContour(b)), (s = !0));
            d = s
                ? JSM.GeneratePrismWithHole(p, k, g, !0, h)
                : JSM.GeneratePrism(p, k, g, !0, h);
            e.push(d);
        }
        a = new JSM.Material({ ambient: a.color, diffuse: a.color });
        return [e, a];
    }
    var u = new JSM.Model();
    t = (function(a, g) {
        function h(a, c, e) {
            a = a.getElementsByTagName(c);
            for (c = 0; c < a.length; c++) e.push(a[c]);
        }
        var n = [],
            l = [];
        h(a, "path", l);
        h(a, "rect", l);
        h(a, "polygon", l);
        var r = g;
        a.hasAttribute("segmentlength") &&
            (r = parseFloat(a.getAttribute("segmentlength")));
        var e, k;
        for (e = 0; e < l.length; e++) (k = A(l[e], r)), n.push(k);
        return n;
    })(n, t);
    n.hasAttribute("modelheight") &&
        (x = parseFloat(n.getAttribute("modelheight")));
    var g, v, w;
    for (n = 0; n < t.length; n++)
        if (((g = B(t[n], x, z)), null !== g)) {
            v = g[0];
            g = g[1];
            u.AddMaterial(g);
            for (g = 0; g < v.length; g++)
                (w = v[g]),
                    w.SetPolygonsMaterialIndex(u.MaterialCount() - 1),
                    u.AddBody(w);
        }
    return u;
};
