import setuptools

pkg_name = "reactopya_gallery"

setuptools.setup(
    name=pkg_name,
    version="0.1.0",
    author="Jeremy Magland",
    author_email="jmagland@flatironinstitute.org",
    description="",
    packages=setuptools.find_packages(),
    scripts=[],
    install_requires=[
        'reactopya',
        'numpy',
        'mountaintools',
        'spikeforest'
    ],
    classifiers=(
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: Apache Software License",
        "Operating System :: OS Independent",
    )
)
