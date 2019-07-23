## @dugla/swc
@dugla/swc is  CLI (command line tool) to support the [SpaceWalk](https://github.com/igvteam/spacewalk) project. 
Use this tool to convert a legacy ensemble or point-cloud file to the file format supported by [SpaceWalk](https://github.com/igvteam/spacewalk).

## Requirements
- Node >= v10.13.0
- NPM >= v6.9.0

### Installation
````
npm install -g @dugla/swc
````

### Usage

``cd`` to the location of the file to be converted

If a point cloud file is being converted:

``swc --pointcloud filename --output filename [--dir output-directory]``

or

``swc -p filename -o filename [-d output-directory]``


[Example Point Cloud File](https://www.dropbox.com/s/lt9fyrhry8lbdqi/2017-08-03-19-34-25_Location-01.csv?dl=0)

snippet ...
```
genome_start,genome_end,size_kb,x,y,z
7400000,8680000,1280,11233.5,6388.48,682.982
7400000,8680000,1280,10894.7,6438.6,735.657
7400000,8680000,1280,11195.4,6304.68,836.743
...
```

If an ensemble file is being converted:

``swc --ensemble filename --output filename [--dir output-directory]``

or

``swc -e filename -o filename [-d output-directory]``

[Example Ensemble File](https://www.dropbox.com/s/ycbj30umsu0y809/IMR90_chr21-18-20Mb.csv?dl=0)

snippet ...

```
The center positions (in nm) in each chromosome of the 30kb segments comprising region chr21:34.6Mb-37.1Mb in HCT116 cells after cell division in auxin treatment (EdU+ and Geminin-)
Chromosome index,Segment index,Z,X,Y
1,1,7289,76301,99573
1,2,6939,76531,99485
1,3,7361,76513,99361
...
```

The default output directory is the current directory. Include ``--dir output-directory`` to  specify a different directory. 

## License

MIT

## Author

- Douglass Turner <douglass.turner@gmail.com>
