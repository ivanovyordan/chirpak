import args from "args"

args
    .option(
        ["n", "no-national"],
        "Do not include national repeaters",
        false,
    )
    .option(
        ["l", "no-local"],
        "Do not include local repeaters",
        false,
    )
    .option(
        ["d", "no-simplex"],
        "Do not include simplex frequencies",
        false,
    )
    .option(
        ["p", "no-pmr"],
        "Do not include PRM frequencies",
        false,
    )
    .option(
        ["s", "no-special"],
        "Do not include special frequencies",
        false,
    )
    .option(
        ["c", "coordinates"],
        "Station coordinates (<lon,lat>)",
        "25.1370926,42.1379215",
        coordinates => coordinates.split(","),
)
    .option(
        ["f", "no-file"],
        "Do not generate a CSV file. Print output to STDOUT instead.",
        false,
    )

export default args.parse(process.argv)
