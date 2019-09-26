KVM:
	make clean_storage;
	HTTP_PORT=3001 P2P_PORT=6001 npm start 
	#node main.js
brs:
	cd core/rs/OnCreate/; make; 
	cd core/rs/VirtualMachine/; make;
	cd core/rs/OnNewBlock/; make;
build_all:
	rm -rf ./node_modules/
	npm install;
	npm rebuild;
	cd core/Lang
	node-gyp rebuild
	./node_modules/.bin/electron-rebuild 
	cd ../../
	node-gyp rebuild 
	./node_modules/.bin/electron-rebuild
	make
save:
	git add * -v;
	git commit -am "default save IDE" -v;
	git push origin master -v ;
build_save_run:	
	say "done" ; 
	make build_all
clean_storage:
	rm -rf -v core/storage/RI_TARGETED core/storage/B_CREATED core/storage/RI_STOREDIN core/storage/A_MINED
	rm -f -v core/storage/BC/*.kb
script_test:
	node core/Script/ScriptTest.js
protocol:
	make clean_storage;
	HTTP_PORT=${HTTP_PORT} P2P_PORT=${P2P_PORT} npm run protocol
protocol_saved:
	HTTP_PORT=3001 P2P_PORT=6001 npm run protocol
build_nodes:
	make build_node_1 ;
	make build_node_2 ; 
	make build_node_3 ; 
	make build_node_4 ; 
build_node_1:
	cd container_factory_1/ ; make ; cd ../ say "node 1 is built" ;
build_node_2:
	cd container_factory_2/ ; make ; cd ../ say "node 2 is built" ;
build_node_3:
	cd container_factory_3/ ; make ; cd ../ say "node 3 is built" ;
build_node_4:
	cd container_factory_4/ ; make ; cd ../ say "node 4 is built" ;
run_nodes:
	cd container_factory_1/ ; make node ; cd ../ ;
	cd container_factory_2/ ; make node ; cd ../ ;
	cd container_factory_3/ ; make node ; cd ../ ;
	cd container_factory_4/ ; make node ; cd ../ ;
save_recurse:
	make save;
	cd core ; git 



